import moment from 'moment';
import { PDFDocument, PDFFont } from 'pdf-lib';
import { addSignature, fillPDFFormFromValues, PDFFieldDefinition } from '../pdf-lib-utils';
import { getFullName } from './utils';
import { W9TaxFormValues } from './frontend-types';
import { getCountryName } from '../i18n';

export const W9FieldsDefinition: Partial<Record<keyof W9TaxFormValues, PDFFieldDefinition>> = {
  signer: { formPath: 'topmostSubform[0].Page1[0].f1_01[0]', transform: getFullName },
  businessName: 'topmostSubform[0].Page1[0].f1_02[0]',
  accountNumbers: 'topmostSubform[0].Page1[0].f1_10[0]',
  exemptPayeeCode: 'topmostSubform[0].Page1[0].f1_05[0]',
  fatcaExemptionCode: 'topmostSubform[0].Page1[0].f1_06[0]',
  federalTaxClassification: {
    type: 'combo',
    values: {
      Individual: 'topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[0]',
      C_Corporation: 'topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[1]',
      S_Corporation: 'topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[2]',
      Partnership: 'topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[3]',
      TrustEstate: 'topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[4]',
      LimitedLiabilityCompany: 'topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[5]',
      Other: 'topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[6]',
    },
  },
  federalTaxClassificationDetails: {
    formPath: 'topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].f1_04[0]',
    if: (value, values) => values.federalTaxClassification === 'Other',
  },
  taxIdNumber: {
    type: 'multi',
    fields: [
      {
        type: 'split-text',
        if: (value, values) => values.taxIdNumberType === 'SSN',
        transform: (value) => value && value.replace(/-/g, '').trim(),
        fields: [
          { formPath: 'topmostSubform[0].Page1[0].f1_11[0]', maxLength: 3 },
          { formPath: 'topmostSubform[0].Page1[0].f1_12[0]', maxLength: 2 },
          { formPath: 'topmostSubform[0].Page1[0].f1_13[0]', maxLength: 4 },
        ],
      },
      {
        type: 'split-text',
        if: (value, values) => values.taxIdNumberType === 'EIN',
        transform: (value) => value && value.replace(/-/g, '').trim(),
        fields: [
          { formPath: 'topmostSubform[0].Page1[0].f1_14[0]', maxLength: 2 },
          { formPath: 'topmostSubform[0].Page1[0].f1_15[0]', maxLength: 7 },
        ],
      },
    ],
  },
  location: {
    type: 'multi',
    fields: [
      {
        formPath: 'topmostSubform[0].Page1[0].Address_ReadOrder[0].f1_07[0]',
        transform: (value: W9TaxFormValues['location']) =>
          [value?.structured?.address1, value?.structured?.address2].filter(Boolean).join(', '),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].Address_ReadOrder[0].f1_08[0]',
        transform: (value: W9TaxFormValues['location']) =>
          [
            value?.structured?.city,
            value?.structured?.zone,
            value?.structured?.postalCode,
            value?.country !== 'US' && getCountryName(value?.country),
          ]
            .filter(Boolean)
            .join(', '),
      },
    ],
  },
};

export const fillW9TaxForm = async (pdfDoc: PDFDocument, values: W9TaxFormValues, font: PDFFont) => {
  const form = pdfDoc.getForm();
  const signerFullName = getFullName(values.signer);

  fillPDFFormFromValues(form, values, W9FieldsDefinition, font);

  const signBoxY = 200;

  // W9 don't have a dedicated date field, so we add it manually
  const firstPage = pdfDoc.getPage(0);
  firstPage.drawText(moment().format('MM/DD/YYYY'), { x: 420, y: signBoxY, size: 10, font });

  // Add date & signature
  if (values.isSigned) {
    await addSignature(pdfDoc, signerFullName, { x: 140, y: signBoxY, fallbackFont: font });
  }
};
