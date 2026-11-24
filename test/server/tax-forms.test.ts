import { describe, expect, test } from 'vitest';
import express from 'express';
import request from 'supertest';
import appRouter from '../../server/index.js';
import { W8BenFieldsDefinition } from '../../server/lib/tax-forms/w8-ben.js';

const encodeValues = (values: Record<string, unknown>) => Buffer.from(JSON.stringify(values)).toString('base64');

describe('Tax forms', () => {
  const app = express();
  app.use('/', appRouter);

  describe('request validation', () => {
    test('returns 400 when formType query param is repeated', async () => {
      const response = await request(app).get('/tax-forms/W9.pdf?formType=W9&formType=W9&values=e30=');
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid form type');
    });

    test('returns 400 when formType query param is repeated (OPTIONS)', async () => {
      const response = await request(app).options('/tax-forms/W9.pdf?formType=W9&formType=W8_BEN');
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid form type');
    });

    test('returns 400 for missing values with a valid form type', async () => {
      const response = await request(app).get('/tax-forms/W9.pdf');
      expect(response.status).toBe(400);
      expect(response.text).toBe('Missing values');
    });
  });

  describe('W8_BEN', () => {
    test('generates a PDF when the optional US taxpayer identification number is missing', async () => {
      const values = {
        beneficialOwner: { firstName: 'John', lastName: 'Doe' },
        countryOfCitizenship: 'FR',
        residenceAddress: { country: 'FR', structured: { address1: '1 Rue de Paris', city: 'Paris' } },
        dateOfBirth: '1990-01-01',
        taxpayerIdentificationNumberForeign: '123456789',
        signer: { firstName: 'John', lastName: 'Doe' },
        isSignerTheBeneficialOwner: true,
      };

      const response = await request(app).get(`/tax-forms/W8_BEN.pdf?values=${encodeValues(values)}`);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/pdf');
    });

    test('strips dashes from the US taxpayer identification number', () => {
      const field = W8BenFieldsDefinition.taxpayerIdentificationNumberUS as unknown as {
        transform: (value: string | undefined) => string;
      };
      expect(field.transform('123-45-6789')).toBe('123456789');
      expect(field.transform(undefined)).toBe('');
    });
  });

  describe('unicode values', () => {
    // Mimics clients (e.g. Python's `json.dumps`) that escape non-ASCII characters as `\uXXXX` sequences
    const encodeValuesWithAsciiEscapes = (values: Record<string, unknown>): string => {
      const json = JSON.stringify(values).replace(
        /[\u007f-\uffff]/g,
        c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
      );
      return Buffer.from(json).toString('base64');
    };

    const getW9Values = (name: string, signer = { firstName: 'John', lastName: 'Doe' }) => ({
      submitterType: 'Business',
      organizationName: `${name} Organization`,
      businessName: `${name} Business`,
      location: { country: 'US', structured: { address1: `${name} Street`, city: 'Test City' } },
      signer,
      isSigned: true,
    });

    const requestPDF = (formType: string, encodedValues: string, isFinal: boolean) =>
      request(app)
        .get(`/tax-forms/${formType}.pdf?values=${encodeURIComponent(encodedValues)}&isFinal=${isFinal}`)
        .buffer(true)
        .parse((res, callback) => {
          const chunks: Buffer[] = [];
          res.on('data', chunk => chunks.push(Buffer.from(chunk)));
          res.on('end', () => callback(null, Buffer.concat(chunks)));
        });

    const expectPDF = (response: request.Response) => {
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/pdf');
      expect((response.body as Buffer).subarray(0, 4).toString()).toBe('%PDF');
    };

    for (const isFinal of [false, true]) {
      test(`renders unicode values sent as JSON escapes (isFinal=${isFinal})`, async () => {
        const encodedValues = encodeValuesWithAsciiEscapes(getW9Values('中文'));
        expect(Buffer.from(encodedValues, 'base64').toString()).toContain('\\u4e2d');
        expectPDF(await requestPDF('W9', encodedValues, isFinal));
      });

      // JSON.stringify always escapes these, so they never appear as raw characters in the request
      for (const [label, char] of [
        ['a control character', '\u0001'],
        ['a lone surrogate', '\ud800'],
      ]) {
        test(`renders values containing ${label} (isFinal=${isFinal})`, async () => {
          const encodedValues = encodeValues(getW9Values(`A${char}B`));
          expect(Buffer.from(encodedValues, 'base64').toString()).toContain(JSON.stringify(char).slice(1, -1));
          expectPDF(await requestPDF('W9', encodedValues, isFinal));
        });
      }
    }
  });
});
