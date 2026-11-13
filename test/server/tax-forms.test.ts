import { describe, expect, test } from 'vitest';
import express from 'express';
import request from 'supertest';
import taxFormsRouter from '../../server/routes/tax-forms.js';

const app = express();
app.use('/tax-forms', taxFormsRouter);

describe('tax-forms', () => {
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
