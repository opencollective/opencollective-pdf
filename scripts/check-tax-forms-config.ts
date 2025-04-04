/**
 * This script ensures that all fields defined in the tax form configs are actually present in the PDFs.
 */

import { isFieldTypeCombo, isFieldTypeMulti, isFieldTypeSplitText, PDFFieldDefinition } from '../lib/pdf-lib-utils';
import { TAX_FORMS } from '../lib/tax-forms';

import { PDFDocument } from 'pdf-lib';

const checkField = (formFields, field: PDFFieldDefinition): string[] => {
  if (typeof field === 'string') {
    if (!formFields.find(f => f.getName() === field)) {
      return [field];
    }
  } else if (isFieldTypeMulti(field) || isFieldTypeSplitText(field)) {
    return field.fields.map(subField => checkField(formFields, subField)).flat();
  } else if (isFieldTypeCombo(field)) {
    return Object.values(field.values)
      .map(subField => checkField(formFields, subField))
      .flat();
  } else if (!formFields.find(f => f.getName() === field.formPath)) {
    return [field.formPath];
  }

  return [];
};

const main = async () => {
  const errors = [];

  for (const [formName, config] of Object.entries(TAX_FORMS)) {
    const pdfDoc = await PDFDocument.load(config.bytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    for (const field of Object.values(config.definition)) {
      const missingFields = checkField(fields, field);
      if (missingFields.length) {
        missingFields.forEach(missingFieldName => {
          errors.push(`Field ${missingFieldName} is missing in ${formName}`);
        });
      }
    }
  }

  if (errors.length > 0) {
    console.error('Errors found:');
    for (const error of errors) {
      console.error(error);
    }
    throw new Error('Some fields are missing in the PDFs');
  } else {
    console.log('All good ✅');
  }
};

// Entrypoint
if (!module.parent) {
  main();
}
