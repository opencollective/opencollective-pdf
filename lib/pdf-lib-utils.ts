import fs from 'fs';
import { get, isNil } from 'lodash';
import { scaleValue } from './math';
import fontkit from 'pdf-fontkit';
import { PDFDocument, PDFField, PDFFont, PDFForm, PDFHexString, PDFTextField, TextAlignment } from 'pdf-lib';
import { allCharsValid } from './string-utils';

const SIGNATURE_FONT_BYTES = fs.readFileSync('resources/fonts/JustMeAgainDownHere-Regular.ttf');

export const logAllFieldsFromPDFForm = (pdfForm) => {
  for (const field of pdfForm.getFields()) {
    if (field.constructor.name === 'PDFTextField') {
      console.log(`${field.constructor.name}<Max: ${field.getMaxLength()}>: ${field.getName()}`);
    } else {
      console.log(`${field.constructor.name}: ${field.getName()}`);
    }
  }
};

const truncateMiddle = (str, limit) => {
  if (!limit) {
    return str;
  } else if (str.length <= limit) {
    return str;
  } else {
    limit -= 1; // For the ellipsis
    const frontChars = Math.ceil(limit / 2);
    const backChars = Math.floor(limit / 2);
    return `${str.slice(0, frontChars)}…${str.slice(-backChars)}`;
  }
};

/**
 * A development helper that makes it easy to identify all fields in a PDF form by filling them with
 * their own names.
 */
export const fillAllFieldsFromPDFFormWithPath = (pdfForm) => {
  for (const field of pdfForm.getFields()) {
    if (field.constructor.name === 'PDFTextField') {
      const maxLength = field.getMaxLength();
      field.setText(truncateMiddle(field.getName(), maxLength));
    }
  }
};

/**
 * Gets the font size for the signature. The longer the text, the smaller the font.
 */
const getSignatureSize = (text: string): number => {
  const maxTextLength = 60; // This is not the real max length (as defined in `components/dashboard/sections/tax-information/common.ts`), but the length that corresponds to the minimum font size.
  return scaleValue(maxTextLength - text.length, [0, maxTextLength], [4, 26], true);
};

/**
 * Generate a signature at the specified position.
 */
export const addSignature = async (pdfDoc: PDFDocument, signerFullName, { page = 0, x, y, fallbackFont }) => {
  pdfDoc.registerFontkit(fontkit);
  let signatureFont = await pdfDoc.embedFont(SIGNATURE_FONT_BYTES, { subset: true });
  let size = getSignatureSize(signerFullName);

  // Handle unsupported characters in signature
  const supportedChars = new Set(signatureFont.getCharacterSet());
  if (!allCharsValid(signerFullName, supportedChars)) {
    if (allCharsValid(signerFullName, new Set(fallbackFont.getCharacterSet()))) {
      signatureFont = fallbackFont;
      size = size * 0.7; // Fallback font is bigger
    } else {
      // Replace unsupported characters with a question mark
      for (let i = 0; i < signerFullName.length; i++) {
        if (!supportedChars.has(signerFullName.charCodeAt(i))) {
          signerFullName = `${signerFullName.slice(0, i)}?${signerFullName.slice(i + 1)}`;
        }
      }
    }
  }

  const pdfPage = pdfDoc.getPage(page);
  pdfPage.drawText(signerFullName, { x, y, font: signatureFont, size });
};

type FieldTypeCombo = {
  type: 'combo';
  values: Record<string, string>;
  if?: (value, allValues) => boolean;
  transform?: (value, allValues) => string;
};

type AdvancedPDFFieldDefinition = {
  formPath: string;
  if?: (value, allValues) => boolean;
  transform?: (value, allValues) => string;
};

type FieldTypeSplitText = {
  type: 'split-text';
  if?: (value, allValues) => boolean;
  transform?: (value, allValues) => string;
  fields: Array<{
    formPath: string;
    maxLength: number | 'auto';
  }>;
};

type FieldTypeNested = {
  type: 'nested';
  if?: (value, allValues) => boolean;
  fields: Record<string, PDFFieldDefinition>;
};

type FieldTypeMulti = {
  type: 'multi';
  if?: (value, allValues) => boolean;
  fields: PDFFieldDefinition[];
};

function isFieldTypeCombo(field: PDFFieldDefinition): field is FieldTypeCombo {
  return (field as FieldTypeCombo).type === 'combo';
}

function isFieldTypeSplitText(field: PDFFieldDefinition): field is FieldTypeSplitText {
  return (field as FieldTypeSplitText).type === 'split-text';
}

function isFieldTypeNested(field: PDFFieldDefinition): field is FieldTypeNested {
  return (field as FieldTypeNested).type === 'nested';
}

function isFieldTypeMulti(field: PDFFieldDefinition): field is FieldTypeMulti {
  return (field as FieldTypeMulti).type === 'multi';
}

function isTextFormField(field: PDFField): field is PDFTextField {
  return field.constructor.name === 'PDFTextField';
}

export type PDFFieldDefinition =
  /** The simplest type possible: just provide the path to the field in the PDF form. Works with text inputs and checkboxes. */
  | string
  /** Adds the ability to pass a transformer */
  | AdvancedPDFFieldDefinition
  /** For multi-checkboxes where only one should be checked */
  | FieldTypeCombo
  | FieldTypeSplitText
  | FieldTypeNested
  | FieldTypeMulti;

/**
 * After setting the value for a text field, PDF-Lib updates its appearance (updateAppearances) using the
 * default font, Helvetica. This causes the text to be rendered in Helvetica, even if a custom font was set before, which
 * can lead to crashes when the text contains characters not supported by Helvetica (e.g. Korean characters).
 *
 * This function sets the content of a text field using a custom font, mostly by re-implementing the setText method without marking the field as dirty (which would trigger the updateAppearances method).
 * If no font is provided, this function will simply call the original setText method.
 *
 * See https://github.com/Hopding/pdf-lib/issues/205
 */
function setTextFieldContentWithFont(textField: PDFTextField, content: string, font: PDFFont = null) {
  if (!font) {
    textField.setText(content);
  } else {
    textField.disableRichFormatting();
    textField.acroField.setValue(PDFHexString.fromText(content));
    textField.updateAppearances(font);
  }
}

function fillValueForField<Values>(
  form: PDFForm,
  field: PDFFieldDefinition,
  value: unknown,
  allValues: Values,
  font: PDFFont = null,
) {
  // Simple field with just the path
  if (typeof field === 'string') {
    const formField = form.getField(field);
    if (isTextFormField(formField)) {
      if (value) {
        formField.setAlignment(TextAlignment.Left);
        setTextFieldContentWithFont(formField, value.toString().trim(), font);
      }
    } else if (formField.constructor.name === 'PDFCheckBox') {
      if (value) {
        form.getCheckBox(field).check();
      }
    }
    return;
  }

  // All rich fields support conditional rendering
  if (field.if && !field.if(value, allValues)) {
    return;
  }

  // Render the field
  if (isFieldTypeNested(field)) {
    for (const [key, nestedField] of Object.entries(field.fields)) {
      fillValueForField(form, nestedField, get(value, key), allValues, font);
    }
  } else if (isFieldTypeMulti(field)) {
    for (const subField of field.fields) {
      fillValueForField(form, subField, value, allValues, font);
    }
  } else if (isFieldTypeCombo(field)) {
    const transform = field.transform || ((v) => v);
    const checkbox = field.values[transform(value, allValues)];
    if (checkbox) {
      form.getCheckBox(checkbox).check();
    }
  } else if (isFieldTypeSplitText(field)) {
    const transformedValue = field.transform ? field.transform(value, allValues) : value;
    if (!isNil(transformedValue) && transformedValue !== '') {
      let start = 0;
      field.fields.forEach(({ formPath, maxLength }) => {
        const subField = form.getTextField(formPath);
        const end = start + (maxLength === 'auto' ? subField.getMaxLength() : maxLength);
        const content = transformedValue.toString().slice(start, end).trim();
        setTextFieldContentWithFont(subField, content, font);
        start = end;
      });
    }
  } else {
    const formPath = field.formPath;
    const transform = field.transform || ((v) => v);
    const transformedValue = transform(value, allValues);
    if (transformedValue) {
      const formField = form.getTextField(formPath);
      formField.setAlignment(TextAlignment.Left);
      const content = transformedValue.toString().trim();
      setTextFieldContentWithFont(formField, content, font);
    }
  }
}

export function fillPDFFormFromValues<Values>(
  form: PDFForm,
  values: Values,
  fields: Partial<Record<keyof Values, PDFFieldDefinition | PDFFieldDefinition[]>>,
  font: PDFFont,
): void {
  for (const [key, fieldDefinitions] of Object.entries<PDFFieldDefinition | PDFFieldDefinition[]>(fields)) {
    const fieldDefinitionsArray = Array.isArray(fieldDefinitions) ? fieldDefinitions : [fieldDefinitions];
    fieldDefinitionsArray.forEach((field) => {
      const value = values[key];
      fillValueForField<Values>(form, field, value, values, font);
    });
  }
}

export function flattenForm(form: PDFForm, { useFallbackReadonly = false } = {}): void {
  if (!useFallbackReadonly) {
    form.flatten();
  } else {
    // PDF lib crashes when it tries to flatten W8 (see https://github.com/Hopding/pdf-lib/issues/1347). We manually
    // mark all fields as read-only instead.
    for (const field of form.getFields()) {
      field.enableReadOnly();
    }
  }
}
