import { expect, test, describe, assert, vi, afterEach } from 'vitest';
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

describe('GET /tax-forms/:formType.pdf', () => {
  // Mimics clients (e.g. Python's `json.dumps`) that escape non-ASCII characters as `\uXXXX` sequences
  const encodeValuesWithAsciiEscapes = (values: Record<string, unknown>): string => {
    const json = JSON.stringify(values).replace(
      /[\u007f-\uffff]/g,
      c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
    );
    return Buffer.from(json).toString('base64');
  };

  const values = {
    submitterType: 'Business',
    organizationName: '中文 Organization',
    businessName: '中文 Business',
    location: { country: 'US', structured: { address1: '中文 Street', city: 'Test City' } },
  };

  for (const isFinal of [false, true]) {
    test(`renders unicode values sent as JSON escapes (isFinal=${isFinal})`, async () => {
      const encodedValues = encodeValuesWithAsciiEscapes(values);
      expect(Buffer.from(encodedValues, 'base64').toString()).toContain('\\u4e2d');
      const response = await request(app)
        .get(`/tax-forms/w9.pdf?values=${encodeURIComponent(encodedValues)}&isFinal=${isFinal}`)
        .buffer(true)
        .parse((res, callback) => {
          const chunks: Buffer[] = [];
          res.on('data', chunk => chunks.push(Buffer.from(chunk)));
          res.on('end', () => callback(null, Buffer.concat(chunks)));
        });
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/pdf');
      expect((response.body as Buffer).subarray(0, 4).toString()).toBe('%PDF');
    }, 60_000);
  }
});

describe('GET /debug-sentry', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('returns a 404 when no debug key is configured', async () => {
    vi.stubEnv('DEBUG_SENTRY_KEY', '');
    const response = await request(app).get('/debug-sentry?key=anything');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  test('returns a 404 when the key does not match', async () => {
    vi.stubEnv('DEBUG_SENTRY_KEY', 'test-secret');
    const response = await request(app).get('/debug-sentry?key=wrong-secret');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  test('throws a 500 (reported to Sentry) when the key matches', async () => {
    vi.stubEnv('DEBUG_SENTRY_KEY', 'test-secret');
    const response = await request(app).get('/debug-sentry?key=test-secret');
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('An internal server error occurred');
  });
});
