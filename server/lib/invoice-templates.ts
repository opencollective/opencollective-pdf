export type InvoiceTemplate = {
  title?: string;
  info?: string;
  embeddedImage?: string;
};

const TEMPLATE_STRING_FIELDS = ['title', 'info', 'embeddedImage'] as const;

/** Text fields where a number (e.g. a year used as title) can safely be rendered as a string */
const TEMPLATE_TEXT_FIELDS: ReadonlyArray<(typeof TEMPLATE_STRING_FIELDS)[number]> = ['title', 'info'];

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Describe an invalid value for logs. Templates are host-controlled, so we only log the type
 * and size, never the content or key names.
 */
const describeValue = (value: unknown): string => {
  if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return `array(${value.length})`;
  } else if (typeof value === 'object') {
    return `object(${Object.keys(value as object).length} keys)`;
  } else {
    return typeof value;
  }
};

/**
 * Invoice templates come from the host's free-form `settings` JSON. React-PDF crashes when a non-string
 * value (e.g. an object) gets rendered as a text child, so we only keep valid string fields and
 * report the invalid ones. Returns `undefined` when the template is missing, invalid, or has no usable field.
 */
export const sanitizeInvoiceTemplate = (rawTemplate: unknown, hostSlug?: string): InvoiceTemplate | undefined => {
  if (rawTemplate === null || rawTemplate === undefined) {
    return undefined;
  } else if (!isPlainObject(rawTemplate)) {
    console.warn(
      `Invalid invoice template for host "${hostSlug}": expected an object, got ${describeValue(rawTemplate)}`,
    );
    return undefined;
  }

  const template: InvoiceTemplate = {};
  for (const field of TEMPLATE_STRING_FIELDS) {
    const value = rawTemplate[field];
    if (value === null || value === undefined || value === '') {
      continue;
    } else if (typeof value === 'string') {
      template[field] = value;
    } else if (typeof value === 'number' && Number.isFinite(value) && TEMPLATE_TEXT_FIELDS.includes(field)) {
      template[field] = String(value);
    } else {
      console.warn(
        `Invalid invoice template field "${field}" for host "${hostSlug}": expected a string, got ${describeValue(value)}`,
      );
    }
  }

  return Object.keys(template).length > 0 ? template : undefined;
};

/**
 * Pick the invoice template to use from the host settings: the named one if it is valid and not empty,
 * otherwise the host's default template.
 */
export const getInvoiceTemplate = (
  hostSettings: unknown,
  invoiceName: string | null | undefined,
  hostSlug?: string,
): InvoiceTemplate | undefined => {
  const invoiceSettings = isPlainObject(hostSettings) ? hostSettings.invoice : undefined;
  const templates = isPlainObject(invoiceSettings) ? invoiceSettings.templates : undefined;
  if (!isPlainObject(templates)) {
    return undefined;
  }

  // Use own properties only, so that names like "constructor" don't resolve to prototype members
  const getTemplate = (name: string) => (Object.hasOwn(templates, name) ? templates[name] : undefined);
  const namedTemplate = invoiceName && invoiceName !== 'default' ? getTemplate(invoiceName) : undefined;
  return sanitizeInvoiceTemplate(namedTemplate, hostSlug) || sanitizeInvoiceTemplate(getTemplate('default'), hostSlug);
};
