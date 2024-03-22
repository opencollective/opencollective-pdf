import moment from 'moment';
import { PDFDocument } from 'pdf-lib';
import { addSignature, fillPDFFormFromValues, PDFFieldDefinition } from '../pdf-lib-utils';
import { getFullName } from './utils';
import { W9TaxFormValues } from './frontend-types';

const W9FieldsDefinition: Partial<Record<keyof W9TaxFormValues, PDFFieldDefinition>> = {
  signer: { formPath: 'topmostSubform[0].Page1[0].f1_1[0]', transform: getFullName },
  businessName: 'topmostSubform[0].Page1[0].f1_2[0]',
  accountNumbers: 'topmostSubform[0].Page1[0].f1_10[0]',
  exemptPayeeCode: 'topmostSubform[0].Page1[0].Exemptions[0].f1_5[0]',
  fatcaExemptionCode: 'topmostSubform[0].Page1[0].Exemptions[0].f1_6[0]',
  federalTaxClassification: {
    type: 'combo',
    values: {
      Individual: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[0]',
      C_Corporation: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[1]',
      S_Corporation: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[2]',
      Partnership: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[3]',
      TrustEstate: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[4]',
      LimitedLiabilityCompany: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[5]',
      Other: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[6]',
    },
  },
  federalTaxClassificationDetails: {
    formPath: 'topmostSubform[0].Page1[0].FederalClassification[0].f1_4[0]',
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
          { formPath: 'topmostSubform[0].Page1[0].SSN[0].f1_11[0]', maxLength: 3 },
          { formPath: 'topmostSubform[0].Page1[0].SSN[0].f1_12[0]', maxLength: 2 },
          { formPath: 'topmostSubform[0].Page1[0].SSN[0].f1_13[0]', maxLength: 4 },
        ],
      },
      {
        type: 'split-text',
        if: (value, values) => values.taxIdNumberType === 'EIN',
        transform: (value) => value && value.replace(/-/g, '').trim(),
        fields: [
          { formPath: 'topmostSubform[0].Page1[0].EmployerID[0].f1_14[0]', maxLength: 2 },
          { formPath: 'topmostSubform[0].Page1[0].EmployerID[0].f1_15[0]', maxLength: 7 },
        ],
      },
    ],
  },
  location: {
    type: 'multi',
    fields: [
      {
        formPath: 'topmostSubform[0].Page1[0].Address[0].f1_7[0]',
        transform: (value: W9TaxFormValues['location']) =>
          [value?.structured?.address1, value?.structured?.address2].filter(Boolean).join(', '),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].Address[0].f1_8[0]',
        transform: (value: W9TaxFormValues['location']) =>
          [value?.structured?.city, value?.structured?.zone, value?.structured?.postalCode].filter(Boolean).join(', '),
      },
    ],
  },
};

export const fillW9TaxForm = async (pdfDoc: PDFDocument, values: W9TaxFormValues) => {
  const form = pdfDoc.getForm();
  const signerFullName = getFullName(values.signer);

  fillPDFFormFromValues(form, values, W9FieldsDefinition);
  console.log(values);
  // W9 don't have a dedicated date field, so we add it manually
  const firstPage = pdfDoc.getPage(0);
  firstPage.drawText(moment().format('MM/DD/YYYY'), { x: 420, y: 235, size: 10 });

  // Add date & signature
  if (values.isSigned) {
    await addSignature(pdfDoc, signerFullName, { x: 140, y: 235 });
  }
};
