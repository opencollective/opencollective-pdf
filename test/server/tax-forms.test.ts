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
});
