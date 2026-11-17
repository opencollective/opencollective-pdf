type InvoiceTemplate = {
  title?: string;
  info?: string;
  embeddedImage?: string;
};

const TEMPLATE_STRING_FIELDS = ['title', 'info', 'embeddedImage'] as const;

const describeValue = (value: unknown): string => {
  if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return `array(${value.length})`;
  } else if (typeof value === 'object') {
    return `object with keys {${Object.keys(value as object).join(', ')}}`;
  } else {
    return typeof value;
  }
};

/**
 * Invoice templates come from the host's free-form `settings` JSON. React-PDF crashes when a non-string
 * value (e.g. an object) gets rendered as a text child, so we only keep valid string fields and
 * report the invalid ones.
 */
export const sanitizeInvoiceTemplate = (rawTemplate: unknown, hostSlug?: string): InvoiceTemplate | undefined => {
  if (rawTemplate === null || rawTemplate === undefined) {
    return undefined;
  } else if (typeof rawTemplate !== 'object' || Array.isArray(rawTemplate)) {
    console.warn(
      `Invalid invoice template for host "${hostSlug}": expected an object, got ${describeValue(rawTemplate)}`,
    );
    return undefined;
  }

  const template: InvoiceTemplate = {};
  for (const field of TEMPLATE_STRING_FIELDS) {
    const value = (rawTemplate as Record<string, unknown>)[field];
    if (value === null || value === undefined || value === '') {
      continue;
    } else if (typeof value === 'string') {
      template[field] = value;
    } else {
      console.warn(
        `Invalid invoice template field "${field}" for host "${hostSlug}": expected a string, got ${describeValue(value)}`,
      );
    }
  }

  return template;
};
