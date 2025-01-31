import { get, pickBy, isEmpty, isNil } from 'lodash';
import { ZERO_DECIMAL_CURRENCIES } from './constants/currency';

export function getCurrencyPrecision(currency) {
  return ZERO_DECIMAL_CURRENCIES.includes(currency) ? 0 : 2;
}

export function formatCurrency(amount, currency = 'USD', options = {}) {
  amount = amount / 100;

  const defaultPrecision = getCurrencyPrecision(currency);
  let minimumFractionDigits = defaultPrecision;
  let maximumFractionDigits = defaultPrecision;

  if (Object.prototype.hasOwnProperty.call(options, 'minimumFractionDigits')) {
    minimumFractionDigits = options.minimumFractionDigits;
  } else if (Object.prototype.hasOwnProperty.call(options, 'precision')) {
    minimumFractionDigits = options.precision;
    maximumFractionDigits = options.precision;
  }

  const result = amount.toLocaleString(getLocaleFromCurrency(currency), {
    style: 'currency',
    currency,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
    currencyDisplay: 'symbol',
  });

  if (options?.showCurrencySymbol && !/^[A-Z]{2,3}\$/.test(result)) {
    return `${currency} ${result}`;
  } else {
    return result;
  }
}

export function formatAmount(amount, options = {}) {
  const valueInCents = amount?.valueInCents || amount?.value * 100;
  return isNil(valueInCents) || isNaN(valueInCents) ? '--,--' : formatCurrency(valueInCents, amount.currency, options);
}

function getLocaleFromCurrency(currency) {
  let locale;
  switch (currency) {
    case 'USD':
      locale = 'en-US';
      break;
    case 'EUR':
      locale = 'en-EU';
      break;
    default:
      locale = currency;
  }
  return locale;
}

export const getEnvVar = (v) => (process.browser ? get(window, ['__NEXT_DATA__', 'env', v]) : get(process, ['env', v]));

export const getBaseImagesUrl = () => getEnvVar('IMAGES_URL') || 'https://opencollective.com';

export function resizeImage(imageUrl, { width, height, query, baseUrl }) {
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

export function isValidImageUrl(src) {
  return src && (src.substr(0, 1) === '/' || src.substr(0, 4).toLowerCase() === 'http');
}

export function imagePreview(src, defaultImage, options = { width: 640 }) {
  if (typeof options.width === 'string') {
    options.width = Number(options.width.replace(/rem/, '')) * 10;
  }
  if (typeof options.height === 'string') {
    options.height = Number(options.height.replace(/rem/, '')) * 10;
  }

  if (src) {
    return resizeImage(src, options);
  }
  if (isValidImageUrl(defaultImage)) {
    return defaultImage;
  }
  return null;
}

export const getTransactionUrl = (transaction) => {
  const domain = 'https://opencollective.com'; // We should have this one change based on env
  const toAccount = transaction.toAccount;
  if (transaction.order?.legacyId) {
    return `${domain}/${toAccount.slug}/contributions/${transaction.order.legacyId}`;
  } else {
    return `${domain}/${toAccount.slug}/transactions`;
  }
};

/**
 * Transorm an object into a query string. Strips undefined values.
 *
 * ## Example
 *
 *    > objectToQueryString({a: 42, b: "hello", c: undefined})
 *    "?a=42&b=hello"
 */
export const objectToQueryString = (options) => {
  const definedOptions = pickBy(options, (value) => value !== undefined);
  if (isEmpty(definedOptions)) {
    return '';
  }

  const encodeValue = (value) => {
    if (Array.isArray(value)) {
      return value.concat.map(encodeURIComponent).join(',');
    }
    return encodeURIComponent(value);
  };

  return `?${Object.entries(definedOptions)
    .map(([key, value]) => `${key}=${encodeValue(value)}`)
    .join('&')}`;
};

export const parseToBooleanDefaultFalse = (value) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  const string = value.toString().trim().toLowerCase();
  return ['on', 'enabled', '1', 'true', 'yes', 1].includes(string);
};

export const parseToBooleanDefaultTrue = (value) => {
  if (value === null || value === undefined || value === '') {
    return true;
  }
  const string = value.toString().trim().toLowerCase();
  return !['off', 'disabled', '0', 'false', 'no', 0].includes(string);
};
