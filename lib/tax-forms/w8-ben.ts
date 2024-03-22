import moment from 'moment';
import { addSignature, fillPDFFormFromValues, PDFFieldDefinition } from '../pdf-lib-utils';
import { PDFDocument } from 'pdf-lib';
import { getFullName } from './utils';
import { W8BenTaxFormValues } from './frontend-types';
import { getCountryName } from '../i18n';

const W8BenFieldsDefinition: Partial<Record<keyof W8BenTaxFormValues, PDFFieldDefinition>> = {
  beneficialOwner: { formPath: 'topmostSubform[0].Page1[0].f_1[0]', transform: getFullName },
  countryOfCitizenship: {
    type: 'multi',
    fields: [
      { formPath: 'topmostSubform[0].Page1[0].f_2[0]', transform: getCountryName },
      {
        formPath: 'topmostSubform[0].Page1[0].f_13[0]',
        transform: getCountryName,
        if: (value, values) => values.claimsSpecialRatesAndConditions && values.certifiesResidentCountry,
      },
    ],
  },
  residenceAddress: {
    type: 'multi',
    fields: [
      {
        formPath: 'topmostSubform[0].Page1[0].f_5[0]',
        transform: (value) => getCountryName(value.country),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].f_3[0]',
        transform: (value: W8BenTaxFormValues['residenceAddress']) =>
          [value?.structured?.address1, value?.structured?.address2].filter(Boolean).join(', '),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].f_4[0]',
        transform: (value: W8BenTaxFormValues['residenceAddress']) =>
          [value?.structured?.city, value?.structured?.zone, value?.structured?.postalCode].filter(Boolean).join(', '),
      },
    ],
  },
  mailingAddress: {
    type: 'multi',
    fields: [
      {
        formPath: 'topmostSubform[0].Page1[0].f_8[0]',
        transform: (value) => getCountryName(value.country),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].f_6[0]',
        transform: (value: W8BenTaxFormValues['mailingAddress']) =>
          [value?.structured?.address1, value?.structured?.address2].filter(Boolean).join(', '),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].f_7[0]',
        transform: (value: W8BenTaxFormValues['mailingAddress']) =>
          [value?.structured?.city, value?.structured?.zone, value?.structured?.postalCode].filter(Boolean).join(', '),
      },
    ],
  },
  dateOfBirth: {
    formPath: 'topmostSubform[0].Page1[0].f_12[0]',
    transform: (value: string) => moment(value).format('MM/DD/YYYY'),
  },
  taxpayerIdentificationNumberForeign: 'topmostSubform[0].Page1[0].f_10[0]',
  taxpayerIdentificationNumberUS: {
    formPath: 'topmostSubform[0].Page1[0].f_9[0]',
    transform: (value: string) => value.replaceAll('-', ''),
  },
  claimsArticleAndParagraph: {
    formPath: 'topmostSubform[0].Page1[0].f_14[0]',
    if: (value, values) => values.hasTaxTreatySpecialRatesAndConditions && values.claimsSpecialRatesAndConditions,
  },
  claimsRate: {
    formPath: 'topmostSubform[0].Page1[0].f_15[0]',
    if: (value, values) => values.hasTaxTreatySpecialRatesAndConditions && values.claimsSpecialRatesAndConditions,
  },
  claimsIncomeType: {
    formPath: 'topmostSubform[0].Page1[0].f_16[0]',
    if: (value, values) => values.hasTaxTreatySpecialRatesAndConditions && values.claimsSpecialRatesAndConditions,
  },
  claimsExplanation: {
    type: 'split-text',
    if: (value, values) => values.hasTaxTreatySpecialRatesAndConditions && values.claimsSpecialRatesAndConditions,
    fields: [
      { formPath: 'topmostSubform[0].Page1[0].f_17[0]', maxLength: 11 },
      { formPath: 'topmostSubform[0].Page1[0].f_18[0]', maxLength: 120 },
    ],
  },
  signer: {
    type: 'multi',
    if: (value, values) => values.isSignerTheBeneficialOwner || values.signerCapacity,
    fields: [
      'topmostSubform[0].Page1[0].c1_02[0]',
      {
        formPath: 'topmostSubform[0].Page1[0].f_21[0]',
        transform: (value, values) =>
          values.isSignerTheBeneficialOwner ? getFullName(values.beneficialOwner) : getFullName(value),
      },
    ],
  },
};

export const fillW8BenTaxForm = async (pdfDoc: PDFDocument, values: W8BenTaxFormValues) => {
  const form = pdfDoc.getForm();
  const signerFullName = getFullName(values.signer);

  fillPDFFormFromValues<W8BenTaxFormValues>(form, values, W8BenFieldsDefinition);

  // Add date & signature
  form.getTextField('topmostSubform[0].Page1[0].Date[0]').setText(moment().format('MM/DD/YYYY'));
  if (values.isSigned) {
    const [signatureWidget] = form.getField('topmostSubform[0].Page1[0].f_20[0]').acroField.getWidgets();
    const signaturePosition = signatureWidget.getRectangle();
    await addSignature(pdfDoc, signerFullName, { page: 0, x: signaturePosition.x, y: signaturePosition.y });
  }
};
