import { expect, test, describe, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import nock from 'nock';
import appRouter from '../../server';
import { snapshotPDF } from '../utils';
import { cloneDeep } from 'lodash-es';

// Test transaction data for a single transaction receipt
const mockTransactionData = {
  data: {
    transaction: {
      id: 'txn1',
      type: 'CREDIT',
      kind: 'CONTRIBUTION',
      createdAt: '2025-01-01',
      description: 'Test Contribution',
      hostCurrencyFxRate: 1,
      invoiceTemplate: 'default',
      isRefund: false,
      permissions: {
        canDownloadInvoice: true,
      },
      order: {
        legacyId: 4242,
        quantity: 1,
      },
      host: {
        id: 'host1',
        slug: 'test-host',
        name: 'Test Host',
        legalName: 'Test Host Legal',
        currency: 'USD',
        imageUrl: 'https://example.com/host.png',
        website: 'https://example.com',
        settings: {
          invoice: {
            templates: {
              default: {
                title: 'Receipt',
                notes: 'Thank you for your contribution',
              },
            },
          },
        },
        type: 'ORGANIZATION',
        location: {
          name: 'Host Location',
          address: '123 Host St',
          country: 'US',
        },
      },
      amount: {
        valueInCents: 1000,
        currency: 'USD',
      },
      amountInHostCurrency: {
        valueInCents: 1000,
        currency: 'USD',
      },
      netAmount: {
        valueInCents: 1000,
        currency: 'USD',
      },
      taxAmount: {
        valueInCents: 0,
        currency: 'USD',
      },
      taxInfo: null,
      paymentMethod: {
        id: 'pm1',
        type: 'CREDIT_CARD',
        service: 'STRIPE',
        name: 'Visa ****4242',
      },
      fromAccount: {
        id: 'user1',
        slug: 'test-user',
        name: 'Test User',
        legalName: 'Test User Legal',
        type: 'USER',
        settings: {},
        location: {
          name: 'User Location',
          address: '456 User St',
          country: 'US',
        },
      },
      toAccount: {
        id: 'coll1',
        slug: 'test-collective',
        name: 'Test Collective',
        legalName: 'Test Collective Legal',
        type: 'COLLECTIVE',
        settings: {},
        location: {
          name: 'Collective Location',
          address: '789 Collective St',
          country: 'US',
        },
      },
    },
  },
};

// Test data for period receipts
const mockPeriodData = {
  data: {
    host: {
      id: 'host1',
      slug: 'test-host',
      name: 'Test Host',
      legalName: 'Test Host Legal',
      currency: 'USD',
      settings: {
        invoice: {
          templates: {
            default: {
              title: 'Receipt',
              notes: 'Thank you for your contributions',
            },
          },
        },
      },
      location: {
        name: 'Host Location',
        address: '123 Host St',
        country: 'US',
      },
    },
    fromAccount: {
      id: 'user1',
      slug: 'test-user',
      name: 'Test User',
      legalName: 'Test User Legal',
      currency: 'USD',
      type: 'USER',
      permissions: {
        canDownloadPaymentReceipts: {
          allowed: true,
        },
      },
      settings: {},
      location: {
        name: 'User Location',
        address: '456 User St',
        country: 'US',
      },
    },
    transactions: {
      totalCount: 51,
      nodes: [
        ...Array.from({ length: 25 }, () => mockTransactionData.data.transaction),
        {
          ...mockTransactionData.data.transaction,
          giftCardEmitterAccount: { id: 'gift1', slug: 'test-gift-card', name: 'Test Gift Card Account' },
        },
        ...Array.from({ length: 25 }, () => mockTransactionData.data.transaction),
      ],
    },
  },
};

const API_URL = process.env.API_URL as string;

describe('Receipts Routes', () => {
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

  describe('Transaction Receipts', () => {
    describe('OPTIONS /receipts/transaction/:id/:filename.pdf', () => {
      test('should respond with 204 status', async () => {
        const response = await request(app).options('/receipts/transaction/txn1/receipt.pdf');
        expect(response.status).toBe(204);
      });
    });

    describe('GET /receipts/transaction/:id/:filename.pdf', () => {
      test('should generate a PDF for a valid transaction', async () => {
        // Mock GraphQL API call
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(mockTransactionData));

        const response = await request(app)
          .get('/receipts/transaction/txn1/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');

        const pdfBuffer = response.body;
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        await snapshotPDF(pdfBuffer, 'transaction_receipt.pdf');
      });

      test('should generate a PDF for a valid ticket transaction', async () => {
        const ticketData = cloneDeep(mockTransactionData);
        ticketData.data.transaction.order['tier'] = { type: 'TICKET' };

        // Mock GraphQL API call
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(ticketData));

        const response = await request(app)
          .get('/receipts/transaction/txn1/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');

        const pdfBuffer = response.body;
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        await snapshotPDF(pdfBuffer, 'transaction_receipt_ticket.pdf');
      });

      test('should return 404 for non-existent transaction', async () => {
        // Mock GraphQL API call returning null transaction
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, { data: { transaction: null } });

        const response = await request(app)
          .get('/receipts/transaction/non-existent/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(404);
      });

      test('should return 403 when user cannot download invoice', async () => {
        // Mock GraphQL API call with transaction without permission
        const noPermissionData = {
          data: {
            transaction: {
              ...mockTransactionData.data.transaction,
              permissions: {
                canDownloadInvoice: false,
              },
            },
          },
        };

        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(noPermissionData));

        const response = await request(app)
          .get('/receipts/transaction/txn1/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(403);
      });

      test('should handle GraphQL errors', async () => {
        // Mock GraphQL API call with error
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(400, {
            errors: [{ message: 'GraphQL Error' }],
          });

        const response = await request(app)
          .get('/receipts/transaction/error/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(400);
      });

      test('should require authentication', async () => {
        const response = await request(app).get('/receipts/transaction/txn1/receipt.pdf');
        expect(response.status).toBe(401);
      });
    });
  });

  describe('Period Receipts', () => {
    describe('OPTIONS /receipts/period/:contributorSlug/:hostSlug/:dateFrom/:dateTo/:filename.pdf', () => {
      test('should respond with 204 status for valid parameters', async () => {
        const response = await request(app).options(
          '/receipts/period/test-user/test-host/2025-01-01/2025-12-31/receipt.pdf',
        );
        expect(response.status).toBe(204);
      });

      test('should validate required parameters', async () => {
        const response = await request(app).options('/receipts/period/test-host/2025-01-01/2025-12-31/receipt.pdf');
        expect(response.status).toBe(404);
      });

      test('should validate date format', async () => {
        const response = await request(app).options(
          '/receipts/period/test-user/test-host/invalid-date/2025-12-31/receipt.pdf',
        );
        expect(response.status).toBe(400);
      });
    });

    describe('GET /receipts/period/:contributorSlug/:hostSlug/:dateFrom/:dateTo/:filename.pdf', () => {
      test('should generate a PDF for a valid period', async () => {
        // Mock GraphQL API call
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(mockPeriodData));

        const response = await request(app)
          .get('/receipts/period/test-user/test-host/2025-01-01/2025-12-31/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');

        const pdfBuffer = response.body;
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        await snapshotPDF(pdfBuffer, 'period_receipt.pdf');
      });

      test('should return 404 for non-existent host', async () => {
        // Mock GraphQL API call returning null host
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, { data: { host: null, fromAccount: mockPeriodData.data.fromAccount } });

        const response = await request(app)
          .get('/receipts/period/test-user/non-existent/2025-01-01/2025-12-31/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(404);
      });

      test('should return 404 for non-existent account', async () => {
        // Mock GraphQL API call returning null fromAccount
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, { data: { host: mockPeriodData.data.host, fromAccount: null } });

        const response = await request(app)
          .get('/receipts/period/non-existent/test-host/2025-01-01/2025-12-31/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(404);
      });

      test('should return 403 when user cannot download receipts', async () => {
        // Mock GraphQL API call with account without permission
        const noPermissionData = {
          data: {
            ...mockPeriodData.data,
            fromAccount: {
              ...mockPeriodData.data.fromAccount,
              permissions: {
                canDownloadPaymentReceipts: {
                  allowed: false,
                },
              },
            },
          },
        };

        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(noPermissionData));

        const response = await request(app)
          .get('/receipts/period/test-user/test-host/2025-01-01/2025-12-31/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(403);
      });

      test('should handle too many transactions', async () => {
        // Mock GraphQL API call with more transactions than nodes
        const tooManyTransactionsData = {
          data: {
            ...mockPeriodData.data,
            transactions: {
              totalCount: 1001,
              nodes: [mockTransactionData.data.transaction],
            },
          },
        };

        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(tooManyTransactionsData));

        const response = await request(app)
          .get('/receipts/period/test-user/test-host/2025-01-01/2025-12-31/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Too many transactions. Please contact support');
      });

      test('should handle GraphQL errors', async () => {
        // Mock GraphQL API call with error
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(400, {
            errors: [{ message: 'GraphQL Error' }],
          });

        const response = await request(app)
          .get('/receipts/period/test-user/test-host/2025-01-01/2025-12-31/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(400);
      });

      test('should require authentication', async () => {
        const response = await request(app).get(
          '/receipts/period/test-user/test-host/2025-01-01/2025-12-31/receipt.pdf',
        );
        expect(response.status).toBe(401);
      });
    });
  });
});
