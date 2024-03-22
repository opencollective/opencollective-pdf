import fs from 'fs';
import { fillW9TaxForm } from './w9';
import { fillW8BenTaxForm } from './w8-ben';
import { PDFDocument } from 'pdf-lib';
import { fillW8BenETaxForm } from './w8-ben-e';

type TaxFormType = 'W9' | 'W8_BEN' | 'W8_BEN_E';

/**
 * Defines all the forms available.
 */
export const TAX_FORMS: Record<
  TaxFormType,
  {
    bytes: Uint8Array;
    fillPDF: (pdfDoc: PDFDocument, values: Record<string, unknown>) => Promise<void>;
  }
> = {
  W9: {
    bytes: fs.readFileSync('resources/tax-forms/fw9.pdf'),
    fillPDF: fillW9TaxForm,
  },
  W8_BEN: {
    bytes: fs.readFileSync('resources/tax-forms/fw8ben.pdf'),
    fillPDF: fillW8BenTaxForm,
  },
  W8_BEN_E: {
    bytes: fs.readFileSync('resources/tax-forms/fw8bene.pdf'),
    fillPDF: fillW8BenETaxForm,
  },
} as const;

export const isValidTaxFormType = (formType: string): formType is keyof typeof TAX_FORMS => {
  return formType in TAX_FORMS;
};
