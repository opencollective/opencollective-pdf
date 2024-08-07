import { PDFDocument, StandardFonts } from 'pdf-lib';
import fontkit from 'pdf-fontkit';
import { TAX_FORMS, isValidTaxFormType } from '../../../lib/tax-forms';
import { getFullName } from '../../../lib/tax-forms/utils';
import { addNonFinalWaterMark, flattenForm } from '../../../lib/pdf-lib-utils';
import { allCharsValid } from '../../../lib/string-utils';
import { setCORSHeaders } from '../../../lib/req-utils';
import { readFileSyncFromPublicStaticFolder } from '../../../lib/file-utils';

const MAIN_FONT_BYTES = readFileSyncFromPublicStaticFolder('fonts/NanumGothic-Regular.ttf');

export default async function handler(req, res) {
  setCORSHeaders(res);
  res.setHeader('cache-control', 'no-cache');

  // Get values from query
  const { formType: rawFormType, values: base64Values, isFinal } = req.query;
  const formType = rawFormType?.toUpperCase();
  if (!formType) {
    res.status(400).send('Missing form type');
    return;
  } else if (!isValidTaxFormType(formType)) {
    res.status(400).send('Invalid form type');
    return;
  }

  // Parse values
  const rawValues = Buffer.from(base64Values, 'base64').toString() || '{}';
  let values;
  try {
    values = JSON.parse(rawValues);
  } catch (e) {
    res.status(400).send('Invalid values');
    return;
  }

  let pdfBytes;
  if (req.method !== 'OPTIONS') {
    // Load file
    const formDefinition = TAX_FORMS[formType];
    const pdfDoc = await PDFDocument.load(formDefinition.bytes);

    // Set metadata
    const signerFullName = getFullName(values.signer);
    const entityName = values.businessName || signerFullName;
    pdfDoc.setTitle(`${formType} Form - ${entityName}`);
    pdfDoc.setSubject(`${formType} Form`);
    pdfDoc.setAuthor(signerFullName || '');
    pdfDoc.setCreator('Open Collective');
    pdfDoc.setCreationDate(new Date());
    pdfDoc.setModificationDate(new Date());
    pdfDoc.setKeywords([formType]);

    // Add custom font to support unicode characters if needed
    const defaultFont = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);
    let customFont = undefined;
    try {
      const defaultCharacterSet = new Set(defaultFont.getCharacterSet());
      if (!allCharsValid(rawValues, defaultCharacterSet)) {
        pdfDoc.registerFontkit(fontkit);
        customFont = await pdfDoc.embedFont(MAIN_FONT_BYTES, { subset: true });
      }
    } catch (e) {
      res.status(500).send('Failed to embed font');
      return;
    }

    // Fill form
    await formDefinition.fillPDF(pdfDoc, values, customFont);

    // If final, flatten the form and attach raw data
    if (isFinal && ['true', '1'].includes(isFinal.toLowerCase())) {
      flattenForm(pdfDoc.getForm(), { useFallbackReadonly: formType !== 'W9' });
      const valueBase64 = Buffer.from(JSON.stringify(values)).toString('base64');
      await pdfDoc.attach(valueBase64, 'raw-data.json', {
        mimeType: 'application/json',
        description: 'Raw form data',
      });
    } else {
      addNonFinalWaterMark(pdfDoc, defaultFont);
    }

    pdfBytes = await pdfDoc.save();
  }

  // Return file
  if (pdfBytes) {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } else {
    res.status(204).send();
  }
}
