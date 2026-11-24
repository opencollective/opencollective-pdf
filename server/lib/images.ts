import { reportErrorToSentry, reportMessageToSentry } from './sentry.js';

export const getBaseImagesUrl = () => process.env.IMAGES_URL || 'https://opencollective.com';

export function resizeImage(
  imageUrl: string,
  { width, height, query, baseUrl }: { width?: number; height?: number; query?: string; baseUrl?: string },
) {
  if (!imageUrl) {
    return null;
  }
  if (imageUrl.substr(0, 1) === '/') {
    return imageUrl;
  } // if image is a local image, we don't resize it with the proxy.
  if (imageUrl.substr(0, 4).toLowerCase() !== 'http') {
    return null;
  } // Invalid imageUrl;
  if (!query && imageUrl.match(/\.svg$/)) {
    return imageUrl;
  } // if we don't need to transform the image, no need to proxy it.
  let queryurl = '';
  if (query) {
    queryurl = encodeURIComponent(query);
  } else {
    if (width) {
      queryurl += `&width=${width}`;
    }
    if (height) {
      queryurl += `&height=${height}`;
    }
  }

  return `${getBaseImagesUrl() || baseUrl || ''}/proxy/images?src=${encodeURIComponent(imageUrl)}${queryurl}`;
}

export function isValidImageUrl(src: string | null | undefined) {
  return src && (src.substr(0, 1) === '/' || src.substr(0, 4).toLowerCase() === 'http');
}

export function imagePreview(
  src: string | null | undefined,
  defaultImage: string | null,
  options: { width?: number | string; height?: number | string } = { width: 640 },
) {
  if (typeof options.width === 'string') {
    options.width = Number(options.width.replace(/rem/, '')) * 10;
  }
  if (typeof options.height === 'string') {
    options.height = Number(options.height.replace(/rem/, '')) * 10;
  }

  if (src) {
    return resizeImage(src, options as { width: number; height: number; query: string; baseUrl: string });
  } else if (isValidImageUrl(defaultImage)) {
    return defaultImage;
  }

  return null;
}

// Invoice templates only render small images (signature, stamp), so we keep the limits tight
export const MAX_EMBEDDED_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const EMBEDDED_IMAGE_FETCH_TIMEOUT_MS = 10_000;

type EmbeddedImageFormat = 'png' | 'jpeg';

/**
 * Detects the image format from the file signature, regardless of the declared content type.
 */
export const detectImageFormat = (buffer: Buffer): EmbeddedImageFormat | null => {
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return 'png';
  } else if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpeg';
  } else {
    return null;
  }
};

type RejectionReason = 'unsupported-source' | 'download-failed' | 'too-large' | 'unsupported-format';

class ImageRejection {
  constructor(
    readonly reason: RejectionReason,
    readonly extra: Record<string, unknown> = {},
  ) {}
}

const readBodyWithLimit = async (response: Response, maxBytes: number): Promise<Buffer | ImageRejection> => {
  if (!response.body) {
    return new ImageRejection('download-failed', { status: response.status });
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return new ImageRejection('too-large', { size: total, maxSize: maxBytes });
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
};

const downloadImage = async (url: string): Promise<Buffer | ImageRejection> => {
  const response = await fetch(url, { signal: AbortSignal.timeout(EMBEDDED_IMAGE_FETCH_TIMEOUT_MS) });
  if (!response.ok) {
    await response.body?.cancel();
    return new ImageRejection('download-failed', { status: response.status });
  }

  const contentLength = Number(response.headers.get('content-length'));
  if (contentLength > MAX_EMBEDDED_IMAGE_SIZE_BYTES) {
    await response.body?.cancel();
    return new ImageRejection('too-large', { size: contentLength, maxSize: MAX_EMBEDDED_IMAGE_SIZE_BYTES });
  }

  return readBodyWithLimit(response, MAX_EMBEDDED_IMAGE_SIZE_BYTES);
};

const getImageBuffer = async (src: string): Promise<Buffer | ImageRejection> => {
  const dataUrlMatch = /^data:image\/(?:png|jpe?g);base64,([a-z0-9+/=\s]*)$/i.exec(src);
  if (dataUrlMatch) {
    const buffer = Buffer.from(dataUrlMatch[1], 'base64');
    return buffer.length <= MAX_EMBEDDED_IMAGE_SIZE_BYTES
      ? buffer
      : new ImageRejection('too-large', { size: buffer.length, maxSize: MAX_EMBEDDED_IMAGE_SIZE_BYTES });
  } else if (/^https?:\/\//i.test(src)) {
    return downloadImage(src);
  } else {
    return new ImageRejection('unsupported-source');
  }
};

const getReportOptions = (src: string, reason: RejectionReason, extra: Record<string, unknown> = {}) => ({
  severity: 'warning' as const,
  tags: { feature: 'pdf-images', reason },
  extra: {
    src: src.startsWith('data:') ? `${src.slice(0, 32)}...` : src.slice(0, 500),
    srcLength: src.length,
    ...extra,
  },
});

/**
 * Loads a user-provided image for an invoice template (e.g. `template.embeddedImage`) and returns it
 * as a PNG or JPEG data URL, or `null` if it can't be used. Only remote http(s) images and inline
 * PNG/JPEG data URLs are accepted, and the content must be a PNG or JPEG file.
 * Rejected images are reported to Sentry as warnings.
 */
export async function loadEmbeddedImage(src: unknown): Promise<string | null> {
  if (typeof src !== 'string' || !src) {
    return null;
  }

  let result: Buffer | ImageRejection;
  try {
    result = await getImageBuffer(src.trim());
  } catch (e) {
    reportErrorToSentry(e, getReportOptions(src, 'download-failed'));
    return null;
  }

  if (result instanceof ImageRejection) {
    reportMessageToSentry(
      `Invoice template image rejected: ${result.reason}`,
      getReportOptions(src, result.reason, result.extra),
    );
    return null;
  }

  const format = detectImageFormat(result);
  if (!format) {
    reportMessageToSentry(
      'Invoice template image rejected: unsupported-format',
      getReportOptions(src, 'unsupported-format', { size: result.length }),
    );
    return null;
  }

  return `data:image/${format};base64,${result.toString('base64')}`;
}
