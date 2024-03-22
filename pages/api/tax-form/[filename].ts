import { PDFDocument } from 'pdf-lib';

import { TAX_FORMS, isValidTaxFormType } from '../../../lib/tax-forms';
import { getFullName } from '../../../lib/tax-forms/utils';

export default async function handler(req, res) {
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

  // Load file
  const formDefinition = TAX_FORMS[formType];
  const pdfDoc = await PDFDocument.load(formDefinition.bytes);

  // Set metadata
  const rawValues = Buffer.from(base64Values, 'base64').toString();
  const values = JSON.parse(rawValues || '{}');
  const signerFullName = getFullName(values.signer);
  const entityName = values.businessName || signerFullName;
  pdfDoc.setTitle(`${formType} Form - ${entityName}`);
  pdfDoc.setSubject(`${formType} Form`);
  pdfDoc.setAuthor(signerFullName || '');
  pdfDoc.setCreator('Open Collective');
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setModificationDate(new Date());
  pdfDoc.setKeywords([formType]);

  // Fill form
  await formDefinition.fillPDF(pdfDoc, values);

  // If final, flatten the form and attach raw data
  if (isFinal) {
    pdfDoc.getForm().flatten();
    const valueBase64 = Buffer.from(JSON.stringify(values)).toString('base64');
    await pdfDoc.attach(valueBase64, 'raw-data.json', {
      mimeType: 'application/json',
      description: 'Raw form data',
    });
  }

  // Return file
  const pdfBytes = await pdfDoc.save();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Access-Control-Allow-Origin', '*'); // TODO
  res.send(Buffer.from(pdfBytes));
}
