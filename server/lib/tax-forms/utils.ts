import { mapValues } from 'lodash-es';
import { isFieldTypeCombo, isFieldTypeMulti, isFieldTypeSplitText, PDFFieldDefinition } from '../pdf-lib-utils.js';

export const getFullName = ({ firstName = undefined, middleName = undefined, lastName = undefined }): string => {
  return [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
};

const getPathsFromField = (field: PDFFieldDefinition): string[] => {
  if (typeof field === 'string') {
    return [field];
  } else if (isFieldTypeMulti(field) || isFieldTypeSplitText(field)) {
    return field.fields.map(subField => getPathsFromField(subField)).flat();
  } else if (isFieldTypeCombo(field)) {
    return Object.values(field.values)
      .map(subField => getPathsFromField(subField))
      .flat();
  } else if (field.formPath) {
    return [field.formPath];
  }

  return [];
};

/**
 * Get a map of all fields from the definition, including all subfields.
 * @returns a map like: { attributeName: ["fieldPath1", "fieldPath2"] }
 */
export const getAllFieldsFromDefinition = (
  definition: Partial<Record<string, PDFFieldDefinition>>,
): Record<string, string[]> => {
  const fields: Record<string, Set<string>> = {};
  for (const [attributeName, field] of Object.entries(definition)) {
    const paths = getPathsFromField(field);
    if (paths.length > 0) {
      fields[attributeName] = fields[attributeName] || new Set();
      for (const path of paths) {
        fields[attributeName].add(path);
      }
    }
  }

  return mapValues(fields, paths => Array.from(paths));
};
