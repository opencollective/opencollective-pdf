import * as Sentry from '@sentry/node';

const SVG_FETCH_TIMEOUT_MS = 5_000;
const SVG_MAX_BYTES = 2 * 1024 * 1024;
const MAX_VIEWBOX_VALUE = 1e6;
const MIN_VIEWBOX_SIZE = 1e-3;

const looksLikeSvg = (content: string) => {
  const str = content.trimStart();
  return str.startsWith('<?xml') || str.startsWith('<svg');
};

/**
 * Returns the reason why react-pdf would fail to render this SVG, or null if it looks renderable.
 *
 * react-pdf uses the root viewBox to compute the aspect ratio transform (see `resolveAspectRatio` in
 * `@react-pdf/render`). Non-finite, huge or near-zero values end up as `Infinity`/`NaN` in pdfkit's
 * `transform`, which throws `unsupported number` and fails the whole document.
 */
export const getInvalidSvgReason = (svg: string): string | null => {
  const rootTag = /<svg\b[^>]*>/i.exec(svg)?.[0];
  if (!rootTag) {
    return null;
  }

  const viewBox = /\sviewBox\s*=\s*(["'])(.*?)\1/is.exec(rootTag)?.[2];
  if (viewBox === undefined) {
    return null;
  }

  const parts = viewBox.trim().split(/[\s,]+/);
  if (parts.length !== 4) {
    return null; // react-pdf ignores viewBoxes that don't have exactly 4 values
  }

  const values = parts.map(Number);
  if (values.some(value => !Number.isFinite(value) || Math.abs(value) > MAX_VIEWBOX_VALUE)) {
    return `invalid viewBox values: "${viewBox}"`;
  } else if (values[2] < MIN_VIEWBOX_SIZE || values[3] < MIN_VIEWBOX_SIZE) {
    return `invalid viewBox size: "${viewBox}"`;
  }

  return null;
};

const loadSvgContent = async (url: string): Promise<string | null> => {
  if (url.startsWith('data:')) {
    const match = /^data:image\/([a-zA-Z+]*);base64,(.*)$/s.exec(url);
    if (!match || !match[1].toLowerCase().startsWith('svg')) {
      return null;
    }
    return Buffer.from(match[2], 'base64').toString('utf-8');
  } else if (!/^https?:\/\//i.test(url)) {
    return null; // Local images are trusted
  }

  const response = await fetch(url, { signal: AbortSignal.timeout(SVG_FETCH_TIMEOUT_MS) });
  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const contentLength = Number(response.headers.get('content-length'));
  const isSvgContentType = contentType.toLowerCase().includes('svg');
  const isRaster = /image\/(png|jpe?g|gif|webp)/i.test(contentType);
  if (isRaster || (contentLength && contentLength > SVG_MAX_BYTES)) {
    await response.body?.cancel();
    return null;
  }

  const content = await response.text();
  if (content.length > SVG_MAX_BYTES || (!isSvgContentType && !looksLikeSvg(content))) {
    return null;
  }

  return content;
};

/**
 * Checks that an image URL that will be passed to react-pdf's `<Image>` does not point to an SVG that would crash
 * the renderer. Returns the URL unchanged if it's safe (or not an SVG), or null if the image must be skipped.
 * Network errors are ignored: react-pdf already handles images that fail to load.
 */
export const sanitizeImageUrl = async <T extends string | null | undefined>(url: T): Promise<T | null> => {
  if (!url) {
    return url;
  }

  let content: string | null;
  try {
    content = await loadSvgContent(url);
  } catch {
    return url;
  }

  const invalidReason = content ? getInvalidSvgReason(content) : null;
  if (!invalidReason) {
    return url;
  }

  const truncatedUrl = url.length > 500 ? `${url.slice(0, 500)}...` : url;
  console.warn(`Skipping invalid SVG image (${invalidReason}): ${truncatedUrl}`);
  Sentry.captureMessage('Skipped invalid SVG image in PDF', {
    level: 'warning',
    extra: { url: truncatedUrl, reason: invalidReason },
  });
  return null;
};
