import { fillW9TaxForm, W9FieldsDefinition } from './w9.js';
import { fillW8BenTaxForm, W8BenFieldsDefinition } from './w8-ben.js';
import { PDFDocument, PDFFont } from 'pdf-lib';
import { fillW8BenETaxForm, W8BenEFieldsDefinition } from './w8-ben-e.js';
import { readFileSyncFromPublicStaticFolder } from '../file-utils.js';
import { PDFFieldDefinition } from '../pdf-lib-utils.js';

type TaxFormType = 'W9' | 'W8_BEN' | 'W8_BEN_E';

/**
 * Defines all the forms available.
 */
export const TAX_FORMS: Record<
  TaxFormType,
  {
    bytes: Uint8Array;
    fillPDF: (pdfDoc: PDFDocument, values: Record<string, unknown>, font: PDFFont | null | undefined) => Promise<void>;
    definition: Partial<Record<string, PDFFieldDefinition>>;
  }
> = {
  W9: {
    bytes: readFileSyncFromPublicStaticFolder('tax-forms/fw9.pdf'),
    fillPDF: fillW9TaxForm,
    definition: W9FieldsDefinition,
  },
  W8_BEN: {
    bytes: readFileSyncFromPublicStaticFolder('tax-forms/fw8ben.pdf'),
    fillPDF: fillW8BenTaxForm,
    definition: W8BenFieldsDefinition,
  },
  W8_BEN_E: {
    bytes: readFileSyncFromPublicStaticFolder('tax-forms/fw8bene.pdf'),
    fillPDF: fillW8BenETaxForm,
    definition: W8BenEFieldsDefinition,
  },
} as const;

export const isValidTaxFormType = (formType: string): formType is keyof typeof TAX_FORMS => {
  return formType in TAX_FORMS;
};
