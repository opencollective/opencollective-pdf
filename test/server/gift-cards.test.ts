import { expect, test, describe } from 'vitest';
import express from 'express';
import request from 'supertest';
import { vi, beforeEach, afterEach } from 'vitest';
import giftCardsRouter from '../../server/routes/gift-cards';

describe('Gift Cards Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use('/gift-cards', giftCardsRouter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('OPTIONS /:filename.pdf', () => {
    test('should respond with 200 status', async () => {
      const response = await request(app).options('/gift-cards/test.pdf');
      expect(response.status).toBe(200);
    });
  });
});
