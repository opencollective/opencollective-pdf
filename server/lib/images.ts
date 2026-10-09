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
