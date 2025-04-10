import { expect, test, describe, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import nock from 'nock';
import appRouter from '../../server';
import { snapshotPDF } from '../utils';

// Test expense data
const mockExpenseData = {
  data: {
    expense: {
      id: 'test-expense',
      legacyId: 1,
      description: 'Test Expense',
      currency: 'USD',
      type: 'INVOICE',
      invoiceInfo: 'Invoice info',
      amount: 1000,
      reference: 'REF123',
      permissions: { canSeeInvoiceInfo: true },
      taxes: [],
      createdAt: '2025-01-01',
      account: {
        id: 'acc1',
        type: 'COLLECTIVE',
        name: 'Test Collective',
        legalName: 'Test Collective Legal',
        slug: 'test-collective',
        imageUrl: 'https://example.com/image.png',
        settings: {},
        location: { address: '123 Test St', country: 'US' },
        host: {
          id: 'host1',
          name: 'Test Host',
          legalName: 'Test Host Legal',
          slug: 'test-host',
          type: 'ORGANIZATION',
          expensePolicy: null,
          settings: {},
          location: { address: '456 Host St', country: 'US' },
        },
      },
      payee: {
        id: 'user1',
        type: 'USER',
        name: 'Test User',
        legalName: 'Test User Legal',
        slug: 'test-user',
        imageUrl: 'https://example.com/user.png',
      },
      payeeLocation: { address: '789 User St', country: 'US' },
      items: [
        {
          id: 'item1',
          description: 'Test Item',
          incurredAt: '2025-01-01',
          url: 'https://example.com/receipt.pdf',
          amountV2: {
            valueInCents: 1000,
            currency: 'USD',
            exchangeRate: null,
          },
        },
      ],
    },
  },
};

const API_URL = process.env.API_URL as string;

describe('Expenses Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/', appRouter);
    nock.disableNetConnect();
    nock.enableNetConnect(host => ['127.0.0.1', 'localhost', API_URL].includes(host.split(':')[0]));
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('OPTIONS /expenses/:id/:filename.pdf', () => {
    test('should respond with 204 status', async () => {
      const response = await request(app).options('/expenses/123/expense.pdf');
      expect(response.status).toBe(204);
    });
  });

  describe('GET /expenses/:id/:filename.pdf', () => {
    test('should generate a PDF for a valid expense', async () => {
      // Mock GraphQL API call
      nock(API_URL)
        .post(/\/graphql\/v2/)
        .reply(200, JSON.stringify(mockExpenseData));

      const response = await request(app)
        .get('/expenses/test-expense/expense.pdf')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');

      const pdfBuffer = response.body;
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);
      await snapshotPDF(pdfBuffer, 'expense_invoice.pdf');
    });

    test('should return 404 for non-existent expense', async () => {
      // Mock GraphQL API call returning null expense
      nock(API_URL)
        .post(/\/graphql\/v2/)
        .reply(200, { data: { expense: null } });

      const response = await request(app)
        .get('/expenses/non-existent/file.pdf')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(404);
    });

    test('should handle GraphQL errors', async () => {
      // Mock GraphQL API call with error
      nock(API_URL)
        .post(/\/graphql\/v2/)
        .reply(400, {
          errors: [{ message: 'GraphQL Error' }],
        });

      const response = await request(app).get('/expenses/error/expense.pdf').set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(400);
    });

    test('should require authentication', async () => {
      const response = await request(app).get('/expenses/test-expense/expense.pdf');

      expect(response.status).toBe(401);
    });
  });
});
