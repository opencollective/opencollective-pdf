import http from 'node:http';
import https from 'node:https';
import { RequestFilteringHttpAgent, RequestFilteringHttpsAgent } from 'request-filtering-agent';
import { parseToBoolean } from './env.js';
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

export function isValidImageUrl(src: string) {
  return src && (src.substr(0, 1) === '/' || src.substr(0, 4).toLowerCase() === 'http');
}

export function imagePreview(
  src: string,
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
export const MAX_EMBEDDED_IMAGE_REDIRECTS = 3;

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

type RejectionReason =
  | 'unsupported-source'
  | 'download-failed'
  | 'too-many-redirects'
  | 'blocked-address'
  | 'too-large'
  | 'unsupported-format';

class ImageRejection {
  constructor(
    readonly reason: RejectionReason,
    readonly extra: Record<string, unknown> = {},
  ) {}
}

/**
 * Invoice template images are only downloaded from public addresses. The check runs on the resolved IP
 * when connecting, and applies to every redirect. Local development (images service, MinIO) runs on
 * private addresses: set `ALLOW_PRIVATE_IMAGE_URLS=true` to allow them (enabled by default in development).
 */
const allowsPrivateImageUrls = (): boolean =>
  parseToBoolean(process.env.ALLOW_PRIVATE_IMAGE_URLS) ?? process.env.NODE_ENV === 'development';

const agents = new Map<string, http.Agent>();
const getAgent = (protocol: 'http:' | 'https:'): http.Agent => {
  const allowPrivateIPAddress = allowsPrivateImageUrls();
  const key = `${protocol}${allowPrivateIPAddress}`;
  if (!agents.has(key)) {
    const options = { allowPrivateIPAddress, allowMetaIPAddress: false };
    agents.set(
      key,
      protocol === 'https:' ? new RequestFilteringHttpsAgent(options) : new RequestFilteringHttpAgent(options),
    );
  }
  return agents.get(key);
};

const isBlockedAddressError = (error: unknown): boolean =>
  error instanceof Error && /^DNS lookup .* is not allowed/.test(error.message);

const isRedirect = (status: number) => [301, 302, 303, 307, 308].includes(status);

const requestImage = (url: URL, signal: AbortSignal): Promise<http.IncomingMessage> =>
  new Promise((resolve, reject) => {
    const client = url.protocol === 'https:' ? https : http;
    const request = client.get(url, { agent: getAgent(url.protocol as 'http:' | 'https:'), signal }, resolve);
    request.on('error', reject);
  });

const readBodyWithLimit = async (
  response: http.IncomingMessage,
  maxBytes: number,
): Promise<Buffer | ImageRejection> => {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of response) {
    total += chunk.length;
    if (total > maxBytes) {
      response.destroy();
      return new ImageRejection('too-large', { size: total, maxSize: maxBytes });
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const downloadImage = async (src: string): Promise<Buffer | ImageRejection> => {
  const signal = AbortSignal.timeout(EMBEDDED_IMAGE_FETCH_TIMEOUT_MS);
  let url = new URL(src);
  for (let redirects = 0; ; redirects++) {
    let response: http.IncomingMessage;
    try {
      response = await requestImage(url, signal);
    } catch (e) {
      if (isBlockedAddressError(e)) {
        return new ImageRejection('blocked-address', { host: url.hostname, redirects });
      }
      throw e;
    }

    const status = response.statusCode ?? 0;
    if (isRedirect(status) && response.headers.location) {
      response.resume();
      if (redirects >= MAX_EMBEDDED_IMAGE_REDIRECTS) {
        return new ImageRejection('too-many-redirects', { redirects: redirects + 1 });
      }
      url = new URL(response.headers.location, url);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return new ImageRejection('unsupported-source', { redirects: redirects + 1 });
      }
      continue;
    } else if (status < 200 || status >= 300) {
      response.resume();
      return new ImageRejection('download-failed', { status, redirects });
    }

    const contentLength = Number(response.headers['content-length']);
    if (contentLength > MAX_EMBEDDED_IMAGE_SIZE_BYTES) {
      response.destroy();
      return new ImageRejection('too-large', { size: contentLength, maxSize: MAX_EMBEDDED_IMAGE_SIZE_BYTES });
    }

    return readBodyWithLimit(response, MAX_EMBEDDED_IMAGE_SIZE_BYTES);
  }
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
 * PNG/JPEG data URLs are accepted, remote images must be on a public address, and the content must be a
 * PNG or JPEG file.
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
