import { reportMessageToSentry } from './sentry.js';

export const getBaseImagesUrl = () => process.env.IMAGES_URL || 'https://opencollective.com';

export function resizeImage(
  imageUrl: string,
  { width, height, query, baseUrl }: { width?: number; height?: number; query?: string; baseUrl?: string },
) {
  if (!imageUrl) {
    return null;
  }
  if (imageUrl.substr(0, 1) === '/' || imageUrl.substr(0, 5).toLowerCase() === 'data:') {
    return imageUrl;
  } // if image is a local image or an already-loaded data URL, we don't resize it with the proxy.
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

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const IMAGE_FETCH_TIMEOUT_MS = 10_000;
// `@react-pdf/layout` walks SVG nodes recursively (`convertParsedNode`), so a deeply nested SVG
// overflows the call stack and crashes the whole PDF generation. Real logos stay far below this.
export const MAX_SVG_DEPTH = 64;
export const MAX_SVG_ELEMENTS = 20_000;

export const isSvgContent = (content: string, contentType?: string | null): boolean => {
  if (contentType && /svg/i.test(contentType)) {
    return true;
  }
  const trimmed = content.trimStart().slice(0, 1024).toLowerCase();
  return trimmed.startsWith('<?xml') || trimmed.startsWith('<svg') || trimmed.includes('<svg');
};

/**
 * Iteratively (no recursion) computes the max element nesting depth and element count of an SVG/XML string.
 */
export const getSvgStructureStats = (svg: string): { maxDepth: number; elementsCount: number } => {
  const withoutComments = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
  const tagRegex = /<(\/?)([a-zA-Z][^\s/>]*)[^>]*?(\/?)>/g;
  let depth = 0;
  let maxDepth = 0;
  let elementsCount = 0;
  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(withoutComments)) !== null) {
    const [, isClosing, , isSelfClosing] = match;
    if (isClosing) {
      depth = Math.max(0, depth - 1);
    } else {
      elementsCount++;
      if (!isSelfClosing) {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      }
    }
  }
  return { maxDepth, elementsCount };
};

const readBodyWithLimit = async (response: Response, maxBytes: number): Promise<Buffer | null> => {
  if (!response.body) {
    return Buffer.from(await response.arrayBuffer());
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
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
};

/**
 * Downloads a remote image and returns it as a data URL that can safely be passed to `@react-pdf`'s
 * `<Image>`. Returns `null` (so the image is simply omitted from the document) when the image
 * cannot be downloaded, is too large, or is an SVG whose structure would crash the renderer.
 * Local paths (starting with `/` or `./`) and data URLs are returned untouched.
 */
export async function loadSafeImage(src: string | null | undefined): Promise<string | null> {
  if (!src) {
    return null;
  } else if (src.startsWith('/') || src.startsWith('./')) {
    return src;
  } else if (src.startsWith('data:')) {
    // Data URLs come from us (e.g. QR codes) - only SVGs need to be validated
    if (!/^data:image\/svg/i.test(src)) {
      return src;
    }
    const match = /^data:image\/svg\+xml;base64,(.*)$/i.exec(src);
    if (!match) {
      return null;
    }
    const content = Buffer.from(match[1], 'base64').toString('utf-8');
    return validateSvg(src, content) ? src : null;
  } else if (!/^https?:\/\//i.test(src)) {
    return null;
  }

  let response: Response;
  try {
    response = await fetch(src, { signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS) });
  } catch (e) {
    console.warn(`Could not fetch image ${src}: ${(e as Error)?.message}`);
    return null;
  }

  if (!response.ok) {
    console.warn(`Could not fetch image ${src}: HTTP ${response.status}`);
    return null;
  }

  const contentLength = Number(response.headers.get('content-length'));
  if (contentLength && contentLength > MAX_IMAGE_SIZE_BYTES) {
    reportRejectedImage(src, 'Image is too large', { contentLength });
    return null;
  }

  let buffer: Buffer | null;
  try {
    buffer = await readBodyWithLimit(response, MAX_IMAGE_SIZE_BYTES);
  } catch (e) {
    console.warn(`Could not download image ${src}: ${(e as Error)?.message}`);
    return null;
  }

  if (!buffer) {
    reportRejectedImage(src, 'Image is too large', { maxBytes: MAX_IMAGE_SIZE_BYTES });
    return null;
  }

  const contentType = response.headers.get('content-type');
  const head = buffer.subarray(0, 1024).toString('utf-8');
  if (isSvgContent(head, contentType)) {
    const content = buffer.toString('utf-8');
    if (!validateSvg(src, content)) {
      return null;
    }
    return `data:image/svg+xml;base64,${buffer.toString('base64')}`;
  }

  const mimeType = contentType?.split(';')[0].trim() || 'image/png';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

const validateSvg = (src: string, content: string): boolean => {
  const { maxDepth, elementsCount } = getSvgStructureStats(content);
  if (maxDepth > MAX_SVG_DEPTH || elementsCount > MAX_SVG_ELEMENTS) {
    reportRejectedImage(src, 'SVG image is too complex to be rendered', {
      maxDepth,
      elementsCount,
      size: content.length,
    });
    return false;
  }
  return true;
};

const reportRejectedImage = (src: string, reason: string, extra: Record<string, unknown>) => {
  console.warn(`Rejected image ${src}: ${reason}`, extra);
  reportMessageToSentry(`Rejected image in PDF: ${reason}`, {
    severity: 'warning',
    tags: { feature: 'pdf-images' },
    extra: { src: src.startsWith('data:') ? `${src.slice(0, 64)}...` : src, ...extra },
  });
};
