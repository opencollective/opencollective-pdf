import moment from 'moment';
import { addSignature, fillPDFFormFromValues, PDFFieldDefinition } from '../pdf-lib-utils';
import { PDFDocument } from 'pdf-lib';
import { getFullName } from './utils';
import { isNil } from 'lodash';
import { W8BenETaxFormValues } from './frontend-types';
import { getCountryName } from '../i18n';

const W8BenEFieldsDefinition: Partial<Record<keyof W8BenETaxFormValues, PDFFieldDefinition>> = {
  businessName: 'topmostSubform[0].Page1[0].f1_1[0]',
  disregardedBusinessName: 'topmostSubform[0].Page1[0].f1_3[0]',
  businessCountryOfIncorporationOrOrganization: {
    formPath: 'topmostSubform[0].Page1[0].f1_2[0]',
    transform: getCountryName,
  },
  chapter3Status: {
    type: 'combo',
    values: {
      Corporation: 'topmostSubform[0].Page1[0].c1_1[0]',
      Partnership: 'topmostSubform[0].Page1[0].c1_1[1]',
      SimpleTrust: 'topmostSubform[0].Page1[0].c1_1[2]',
      TaxExemptOrganization: 'topmostSubform[0].Page1[0].c1_1[3]',
      ComplexTrust: 'topmostSubform[0].Page1[0].c1_1[4]',
      ForeignGovernmentControlledEntity: 'topmostSubform[0].Page1[0].c1_1[5]',
      CentralBankOfIssue: 'topmostSubform[0].Page1[0].c1_1[6]',
      PrivateFoundation: 'topmostSubform[0].Page1[0].c1_1[7]',
      Estate: 'topmostSubform[0].Page1[0].c1_1[8]',
      ForeignGovernmentIntegralPart: 'topmostSubform[0].Page1[0].c1_1[9]',
      GrantorTrust: 'topmostSubform[0].Page1[0].c1_1[10]',
      DisregardedEntity: 'topmostSubform[0].Page1[0].c1_1[11]',
      InternationalOrganization: 'topmostSubform[0].Page1[0].c1_1[12]',
    },
  },
  isHybridEntity: {
    type: 'combo',
    transform: (value) => (isNil(value) ? null : value ? 'yes' : 'no'),
    values: {
      yes: 'topmostSubform[0].Page1[0].c1_2[0]',
      no: 'topmostSubform[0].Page1[0].c1_2[1]',
    },
  },
  certifyDerivesIncome: 'topmostSubform[0].Page2[0].c2_4[0]',
  typeOfLimitationOnBenefitsProvisions: {
    type: 'combo',
    values: {
      Government: 'topmostSubform[0].Page2[0].CheckboxesLine14b_ReadOrder[0].c2_5[0]',
      TaxExemptPensionTrustOrPensionFund: 'topmostSubform[0].Page2[0].CheckboxesLine14b_ReadOrder[0].c2_5[1]',
      OtherTaxExemptOrganization: 'topmostSubform[0].Page2[0].CheckboxesLine14b_ReadOrder[0].c2_5[2]',
      PubliclyTradedCorporation: 'topmostSubform[0].Page2[0].CheckboxesLine14b_ReadOrder[0].c2_5[3]',
      SubsidiaryOfAPubliclyTradedCorporation: 'topmostSubform[0].Page2[0].CheckboxesLine14b_ReadOrder[0].c2_5[4]',
      CompanyThatMeetsTheOwnershipAndBaseErosionTest: 'topmostSubform[0].Page2[0].c2_5[0]',
      CompanyThatMeetsTheDerivativeBenefitsTest: 'topmostSubform[0].Page2[0].c2_5[1]',
      CompanyWithAnItemOfIncomeThatMeetsActiveTradeOrBusinessTest: 'topmostSubform[0].Page2[0].c2_5[2]',
      FavorableDiscretionaryDeterminationByTheUSCompetentAuthorityReceived: 'topmostSubform[0].Page2[0].c2_5[3]',
      NoLOBArticleInTreaty: 'topmostSubform[0].Page2[0].c2_5[4]',
      Other: 'topmostSubform[0].Page2[0].c2_5[5]',
    },
  },
  typeOfLimitationOnBenefitsProvisionsOther: 'topmostSubform[0].Page2[0].f2_10[0]',
  certifyBeneficialOwnerCountry: 'topmostSubform[0].Page2[0].c2_3[0]',
  taxpayerIdentificationNumberUS: 'topmostSubform[0].Page2[0].f2_1[0]',
  taxpayerIdentificationNumberForeign: 'topmostSubform[0].Page2[0].Line9b_ReadOrder[0].f2_3[0]',
  claimsArticleAndParagraph: {
    formPath: 'topmostSubform[0].Page2[0].f2_11[0]',
    if: (value, values) => values.claimsSpecialRatesAndConditions,
  },
  claimsRate: {
    formPath: 'topmostSubform[0].Page2[0].f2_12[0]',
    if: (value, values) => values.claimsSpecialRatesAndConditions,
  },
  claimsIncomeType: {
    formPath: 'topmostSubform[0].Page2[0].f2_13[0]',
    if: (value, values) => values.claimsSpecialRatesAndConditions,
  },
  claimsExplanation: {
    type: 'split-text',
    fields: [
      { formPath: 'topmostSubform[0].Page2[0].f2_14[0]', maxLength: 18 },
      { formPath: 'topmostSubform[0].Page2[0].f2_15[0]', maxLength: 120 },
      { formPath: 'topmostSubform[0].Page2[0].f2_16[0]', maxLength: 120 },
    ],
  },
  businessAddress: {
    type: 'multi',
    fields: [
      {
        formPath: 'topmostSubform[0].Page1[0].f1_6[0]',
        transform: (value: W8BenETaxFormValues['businessAddress']) => getCountryName(value.country),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].f1_4[0]',
        transform: (value: W8BenETaxFormValues['businessAddress']) =>
          [value?.structured?.address1, value?.structured?.address2].filter(Boolean).join(', '),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].f1_5[0]',
        transform: (value: W8BenETaxFormValues['businessAddress']) =>
          [value?.structured?.city, value?.structured?.zone, value?.structured?.postalCode].filter(Boolean).join(', '),
      },
    ],
  },
  businessMailingAddress: {
    type: 'multi',
    fields: [
      {
        formPath: 'topmostSubform[0].Page1[0].f1_9[0]',
        transform: (value: W8BenETaxFormValues['businessMailingAddress']) => getCountryName(value.country),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].f1_7[0]',
        transform: (value: W8BenETaxFormValues['businessMailingAddress']) =>
          [value?.structured?.address1, value?.structured?.address2].filter(Boolean).join(', '),
      },
      {
        formPath: 'topmostSubform[0].Page1[0].f1_8[0]',
        transform: (value: W8BenETaxFormValues['businessMailingAddress']) =>
          [value?.structured?.city, value?.structured?.zone, value?.structured?.postalCode].filter(Boolean).join(', '),
      },
    ],
  },
  reference: 'topmostSubform[0].Page2[0].f2_4[0]',
  giin: 'topmostSubform[0].Page2[0].Line9a_ReadOrder[0].f2_2[0]',
  usOwners: 'topmostSubform[0].Page8[0].Table_Part29[0].BodyRow1[0].f8_3[0]',
  signer: {
    formPath: 'topmostSubform[0].Page8[0].f8_31[0]',
    transform: getFullName,
  },
} as const;

export const fillW8BenETaxForm = async (pdfDoc: PDFDocument, values: W8BenETaxFormValues) => {
  const form = pdfDoc.getForm();
  const signerFullName = getFullName(values.signer);

  // Fill form
  fillPDFFormFromValues<W8BenETaxFormValues>(form, values, W8BenEFieldsDefinition);

  // Add date & signature
  form.getTextField('topmostSubform[0].Page8[0].f8_32[0]').setText(moment().format('MM/DD/YYYY'));
  if (values.isSigned) {
    const [signatureWidget] = form.getField('topmostSubform[0].Page8[0].f8_30[0]').acroField.getWidgets();
    const signaturePosition = signatureWidget.getRectangle();
    await addSignature(pdfDoc, signerFullName, { page: 7, x: signaturePosition.x, y: signaturePosition.y });
  }
};
