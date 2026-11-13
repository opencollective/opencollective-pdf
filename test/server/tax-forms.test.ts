import { describe, expect, test } from 'vitest';
import express from 'express';
import request from 'supertest';
import appRouter from '../../server/index.js';
import { W8BenFieldsDefinition } from '../../server/lib/tax-forms/w8-ben.js';

const encodeValues = (values: Record<string, unknown>) => Buffer.from(JSON.stringify(values)).toString('base64');

describe('Tax forms', () => {
  const app = express();
  app.use('/', appRouter);

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
