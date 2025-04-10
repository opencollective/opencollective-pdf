import { expect, test, describe } from 'vitest';
import express from 'express';
import request from 'supertest';
import { beforeEach } from 'vitest';
import appRouter from '../../server/index.js';
import { snapshotPDF } from '../utils.js';

describe('Gift Cards Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/', appRouter);
  });

  describe('OPTIONS /:filename.pdf', () => {
    test('should respond with 200 status', async () => {
      const response = await request(app).options('/gift-cards/test.pdf');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /:filename.pdf', () => {
    describe('from a JSON payload', () => {
      test('should generate an empty PDF', async () => {
        const response = await request(app).post('/gift-cards/test.pdf').send({});
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');

        // Check content
        const pdfBuffer = response.body;
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        await snapshotPDF(pdfBuffer, 'gift-cards_empty.pdf');
      });

      test('should generate a multi-page PDF with gift cards', async () => {
        const cards = Array.from({ length: 20 }, () => ({
          uuid: '12345678-1234-1234-1234-123456789012',
          name: 'Test Card',
          expiryDate: '2024-12-31',
          initialBalance: 500,
          currency: 'USD',
        }));

        const response = await request(app).post('/gift-cards/test.pdf').send({ cards });
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');

        // Check content
        const pdfBuffer = response.body;
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        await snapshotPDF(pdfBuffer, 'gift-cards_multi-page.pdf');
      });
    });
  });

  describe('GET /:filename.pdf with a query string', () => {
    test('should generate a PDF with a query string', async () => {
      const response = await request(app).get('/gift-cards/test.pdf');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');

      // Check content
      const pdfBuffer = response.body;
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);
      await snapshotPDF(pdfBuffer, 'gift-cards_query_empty.pdf');
    });

    test('should generate a PDF with a query string and cards', async () => {
      const cards = Array.from({ length: 20 }, () => ({
        uuid: '12345678-1234-1234-1234-123456789012',
        name: 'Test Card',
        expiryDate: '2024-12-31',
        initialBalance: 500,
        currency: 'USD',
      }));

      const response = await request(app).get(
        '/gift-cards/test.pdf?cards=' + encodeURIComponent(JSON.stringify(cards)),
      );
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');

      const pdfBuffer = response.body;
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);
      await snapshotPDF(pdfBuffer, 'gift-cards_query_with_cards.pdf');
    });
  });
});
