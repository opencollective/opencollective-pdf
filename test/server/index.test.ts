import { expect, test, describe, assert } from 'vitest';
import request from 'supertest';
import app from '../../server/index.js';
import { PDFDocument, rgb } from 'pdf-lib';
import { TAX_FORMS } from '../../server/lib/tax-forms/index.js';
import { getAllFieldsFromDefinition } from '../../server/lib/tax-forms/utils.js';
import { snapshotPDF } from '../utils.js';

describe('Tax forms', () => {
  test('returns a 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  describe('PDF Field Visualization', () => {
    for (const [formType, formConfig] of Object.entries(TAX_FORMS)) {
      test(`Show fields for ${formType}`, async () => {
        // Get all fields from the definition
        const allFields = getAllFieldsFromDefinition(formConfig.definition);

        // Load the PDF
        const pdfDoc = await PDFDocument.load(formConfig.bytes);
        const form = pdfDoc.getForm();
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont('Helvetica');

        // For each field attribute, draw red boxes over all its field paths
        for (const [attributeName, fieldPaths] of Object.entries(allFields)) {
          for (const fieldPath of fieldPaths) {
            const field = form.getField(fieldPath);
            assert(field, `Field ${fieldPath} not found in ${formType}, but mapped in the definition`);

            const widgets = field.acroField.getWidgets();

            for (const widget of widgets) {
              // Get the page reference from the widget
              const widgetPageRef = widget.P();

              // Find the corresponding page index
              const pageIndex = pages.findIndex(page => page.ref === widgetPageRef);

              if (pageIndex !== -1) {
                const page = pages[pageIndex];
                const rect = widget.getRectangle();

                // Draw red box around the field
                page.drawRectangle({
                  x: rect.x,
                  y: rect.y,
                  width: rect.width,
                  height: rect.height,
                  borderColor: rgb(1, 0, 0),
                  borderWidth: 2,
                });

                // Draw label above the field in red
                const labelText = attributeName;
                const fontSize = 8;
                const padding = 2;
                const labelY = rect.y + padding;

                // Calculate text dimensions
                const textWidth = font.widthOfTextAtSize(labelText, fontSize);
                const textHeight = font.heightAtSize(fontSize);

                // Draw white background behind the label
                page.drawRectangle({
                  x: rect.x - padding,
                  y: labelY - padding,
                  width: textWidth + padding * 2,
                  height: textHeight + padding * 2,
                  color: rgb(1, 1, 1),
                });

                page.drawText(labelText, {
                  x: rect.x,
                  y: labelY,
                  size: fontSize,
                  color: rgb(1, 0, 0),
                });
              }
            }
          }
        }

        // Save the PDF and snapshot it
        const pdfBytes = await pdfDoc.save();
        await snapshotPDF(Buffer.from(pdfBytes), `tax-form-fields-${formType.toLowerCase()}.pdf`);
      }, 60_000); // 60 second timeout for PDF processing (slower in CI)
    }
  });
});
