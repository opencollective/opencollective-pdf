import express from 'express';
import fontkit from 'pdf-fontkit';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { readFileSyncFromPublicStaticFolder } from '../lib/file-utils.js';
import { addNonFinalWaterMark, flattenForm } from '../lib/pdf-lib-utils.js';
import { allCharsValid } from '../lib/string-utils.js';
import { isValidTaxFormType, TAX_FORMS } from '../lib/tax-forms/index.js';
import { getFullName } from '../lib/tax-forms/utils.js';

const router = express.Router();

const getValuesFromRequest = (req: express.Request, res: express.Response) => {
  const { formType: rawFormType, values: base64Values, isFinal } = req.query;
  const formType = (rawFormType as string | undefined)?.toUpperCase();
  if (!formType) {
    res.status(400).send('Missing form type');
    return;
  } else if (!isValidTaxFormType(formType)) {
    res.status(400).send('Invalid form type');
    return;
  }

  const rawValues = Buffer.from(base64Values as string, 'base64').toString() || '{}';
  try {
    const values = JSON.parse(rawValues);
    return { formType, rawValues, values, isFinal: isFinal?.toString() };
  } catch (e) {
    console.error('Error parsing values:', e);
    res.status(400).send('Invalid values');
    return;
  }
};

router.options('/:formType.pdf', (req, res) => {
  if (getValuesFromRequest(req, res)) {
    res.sendStatus(204);
  }
});

const MAIN_FONT_BYTES = readFileSyncFromPublicStaticFolder('fonts/NanumGothic-Regular.ttf');

router.get('/:formType.pdf', async (req: express.Request, res: express.Response) => {
  const parsedRequest = getValuesFromRequest(req, res);
  if (!parsedRequest) {
    res.status(400).send('Invalid request');
    return;
  }

  const { formType, rawValues, values, isFinal } = parsedRequest;

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
    console.error('Error embedding font:', e);
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

  const pdfBytes = await pdfDoc.save();
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdfBytes));
});

export default router;
