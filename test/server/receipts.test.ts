import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import nock from 'nock';
import appRouter from '../../server/index.js';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createPng, getPdfImageWidths, snapshotPDF } from '../utils.js';
import { cloneDeep } from 'lodash-es';
import Receipt from '../../server/components/receipts/Receipt.js';

/** Spy on the receipt rendering to get the template that was passed to the PDF */
const spyOnRenderedTemplates = () => {
  const spy = vi.spyOn(Receipt.prototype, 'render');
  return () => spy.mock.contexts.map(receipt => (receipt as Receipt).props.receipt.template);
};

// Test transaction data for a single transaction receipt
const mockTransactionData = {
  data: {
    transaction: {
      id: 'txn1',
      type: 'CREDIT',
      kind: 'CONTRIBUTION',
      createdAt: '2025-01-01',
      clearedAt: null as string | null,
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
    vi.restoreAllMocks();
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

      test('should render the effective date when it differs from the ledger date', async () => {
        const transactionData = cloneDeep(mockTransactionData);
        transactionData.data.transaction.createdAt = '2025-01-05T10:00:00Z';
        transactionData.data.transaction.clearedAt = '2024-12-28T10:00:00Z';
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(transactionData));

        const response = await request(app)
          .get('/receipts/transaction/txn1/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        await snapshotPDF(response.body, 'transaction_receipt_effective_date.pdf');
      });

      test('should render CJK contributor details', async () => {
        const cjkTransactionData = cloneDeep(mockTransactionData);
        cjkTransactionData.data.transaction.fromAccount.legalName =
          'Code for Japan (一般社団法人 コード・フォー・ジャパン)';
        cjkTransactionData.data.transaction.fromAccount.location = {
          name: '東京都',
          address: '〒100073 東京都千代田区九段北3-26',
          country: 'JP',
        };

        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(cjkTransactionData));

        const response = await request(app)
          .get('/receipts/transaction/txn1/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');
        expect(response.body).toBeInstanceOf(Buffer);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.toString('latin1')).toContain('NanumGothic');
      });

      test('should render CJK contributor details', async () => {
        const cjkTransactionData = cloneDeep(mockTransactionData);
        cjkTransactionData.data.transaction.fromAccount.legalName =
          'Code for Japan (一般社団法人 コード・フォー・ジャパン)';
        cjkTransactionData.data.transaction.fromAccount.location = {
          name: '東京都',
          address: '〒100073 東京都千代田区九段北3-26',
          country: 'JP',
        };

        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(cjkTransactionData));

        const response = await request(app)
          .get('/receipts/transaction/txn1/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        await snapshotPDF(response.body, 'transaction_receipt_cjk.pdf');
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

      describe('embedded image', () => {
        const embeddedPng = createPng(3, 2);
        const svg =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 Infinity"><rect width="10" height="10"/></svg>';
        const complexSvgs = [
          `<svg xmlns="http://www.w3.org/2000/svg">${'<g>'.repeat(3000)}<rect/>${'</g>'.repeat(3000)}</svg>`,
          `<svg xmlns="http://www.w3.org/2000/svg">${'<g></x>'.repeat(3000)}<rect/></svg>`,
          `<svg xmlns="http://www.w3.org/2000/svg"><g x="${'><g>'.repeat(3000)}<rect/>"/></svg>`,
        ];

        const requestReceipt = async (embeddedImage: unknown) => {
          const transactionData = cloneDeep(mockTransactionData);
          transactionData.data.transaction.host.settings.invoice.templates.default['embeddedImage'] = embeddedImage;
          nock(API_URL)
            .post(/\/graphql\/v2/)
            .reply(200, JSON.stringify(transactionData));
          const response = await request(app)
            .get('/receipts/transaction/txn1/receipt.pdf')
            .set('Authorization', 'Bearer test-token');
          expect(response.status).toBe(200);
          expect(response.headers['content-type']).toBe('application/pdf');
          return getPdfImageWidths(response.body);
        };

        // Images that can't be used are replaced with a transparent 1x1 placeholder
        const expectPlaceholderOnly = (imageWidths: number[]) => {
          expect(imageWidths.length).toBeGreaterThan(0);
          expect(imageWidths.every(width => width === 1)).toBe(true);
        };

        test('should embed a remote PNG image', async () => {
          nock('https://example.com').get('/signature.png').reply(200, embeddedPng, { 'Content-Type': 'image/png' });
          expect(await requestReceipt('https://example.com/signature.png')).toContain(3);
        });

        test('should embed a remote PNG image served with a generic content type', async () => {
          nock('https://example.com')
            .get('/signature')
            .reply(200, embeddedPng, { 'Content-Type': 'application/octet-stream' });
          expect(await requestReceipt('https://example.com/signature')).toContain(3);
        });

        test('should embed an inline PNG image', async () => {
          expect(await requestReceipt(`data:image/png;base64,${embeddedPng.toString('base64')}`)).toContain(3);
        });

        test('should skip SVG images, including when served as PNG', async () => {
          nock('https://example.com')
            .get('/signature.svg')
            .reply(200, svg, { 'Content-Type': 'image/svg+xml' })
            .get('/signature.png')
            .reply(200, svg, { 'Content-Type': 'image/png' });
          expectPlaceholderOnly(await requestReceipt('https://example.com/signature.svg'));
          expectPlaceholderOnly(await requestReceipt('https://example.com/signature.png'));
          expectPlaceholderOnly(
            await requestReceipt(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`),
          );
        });

        test('should skip complex SVG images', async () => {
          for (const [index, complexSvg] of complexSvgs.entries()) {
            nock('https://example.com')
              .get(`/complex-${index}.svg`)
              .reply(200, complexSvg, { 'Content-Type': 'image/svg+xml' });
            expectPlaceholderOnly(await requestReceipt(`https://example.com/complex-${index}.svg`));
          }
        });

        test('should only download images from public addresses', async () => {
          const server = http.createServer((req, res) =>
            res.writeHead(200, { 'Content-Type': 'image/png' }).end(embeddedPng),
          );
          await new Promise<void>(resolve => server.listen(0, resolve));
          try {
            nock.enableNetConnect('127.0.0.1');
            const { port } = server.address() as AddressInfo;
            expectPlaceholderOnly(await requestReceipt(`http://127.0.0.1:${port}/signature.png`));
          } finally {
            await new Promise(resolve => server.close(resolve));
          }
        });

        test('should only allow remote or inline images', async () => {
          const localFile = path.resolve('public/static/images/giftcard.png');
          for (const value of ['./public/static/images/giftcard.png', localFile, pathToFileURL(localFile).href]) {
            expectPlaceholderOnly(await requestReceipt(value));
          }
        });
      });

      test('should ignore invalid (non-string) template fields', async () => {
        const getRenderedTemplates = spyOnRenderedTemplates();
        const invalidTemplateData = cloneDeep(mockTransactionData);
        invalidTemplateData.data.transaction.host.settings.invoice.templates.default = {
          title: { a: 'x' },
          info: 'Valid info',
          embeddedImage: ['not', 'a', 'string'],
        } as unknown as (typeof invalidTemplateData.data.transaction.host.settings.invoice.templates)['default'];

        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(invalidTemplateData));

        const response = await request(app)
          .get('/receipts/transaction/txn1/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');
        expect(response.body).toBeInstanceOf(Buffer);
        expect(response.body.length).toBeGreaterThan(0);
        expect(getRenderedTemplates().at(-1)).toEqual({ info: 'Valid info' });
      });

      test('should fall back to the default template when the named template is invalid', async () => {
        const getRenderedTemplates = spyOnRenderedTemplates();
        const transactionData = cloneDeep(mockTransactionData);
        transactionData.data.transaction.invoiceTemplate = 'alternative';
        transactionData.data.transaction.host.settings.invoice.templates = {
          default: { title: 'Default title', info: 'Default info' },
          alternative: { title: { a: 'x' } },
        } as unknown as typeof transactionData.data.transaction.host.settings.invoice.templates;

        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(transactionData));

        const response = await request(app)
          .get('/receipts/transaction/txn1/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');
        expect(getRenderedTemplates().at(-1)).toEqual({ title: 'Default title', info: 'Default info' });
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

      test('should only embed PNG or JPEG images from the invoice template', async () => {
        const periodData = cloneDeep(mockPeriodData);
        periodData.data.host.settings.invoice.templates.default['embeddedImage'] = 'https://example.com/signature.png';
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(periodData))
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(periodData));
        nock('https://example.com')
          .get('/signature.png')
          .reply(200, createPng(3, 2), { 'Content-Type': 'application/octet-stream' })
          .get('/signature.png')
          .reply(200, '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>', { 'Content-Type': 'image/png' });

        const url = '/receipts/period/test-user/test-host/2025-01-01/2025-12-31/receipt.pdf';
        const withPng = await request(app).get(url).set('Authorization', 'Bearer test-token');
        expect(withPng.status).toBe(200);
        expect(getPdfImageWidths(withPng.body)).toContain(3);

        const withSvg = await request(app).get(url).set('Authorization', 'Bearer test-token');
        expect(withSvg.status).toBe(200);
        expect(getPdfImageWidths(withSvg.body)).not.toContain(3);
      });

      test('should ignore invalid (non-string) template fields', async () => {
        const getRenderedTemplates = spyOnRenderedTemplates();
        const periodData = cloneDeep(mockPeriodData);
        periodData.data.host.settings.invoice.templates.default = {
          title: { a: 'x' },
          info: 'Valid info',
        } as unknown as (typeof periodData.data.host.settings.invoice.templates)['default'];

        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(periodData));

        const response = await request(app)
          .get('/receipts/period/test-user/test-host/2025-01-01/2025-12-31/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');
        expect(response.body.length).toBeGreaterThan(0);
        expect(getRenderedTemplates().at(-1)).toEqual({ info: 'Valid info' });
      });

      test('should render effective dates in period receipts', async () => {
        const periodData = cloneDeep(mockPeriodData);
        periodData.data.transactions.totalCount = 3;
        periodData.data.transactions.nodes = [
          { ...mockTransactionData.data.transaction, id: 'txn1', createdAt: '2025-01-05', clearedAt: '2025-01-05' },
          { ...mockTransactionData.data.transaction, id: 'txn2', createdAt: '2025-02-10', clearedAt: '2025-01-30' },
          { ...mockTransactionData.data.transaction, id: 'txn3', createdAt: '2025-03-15', clearedAt: null },
        ];
        nock(API_URL)
          .post(/\/graphql\/v2/)
          .reply(200, JSON.stringify(periodData));

        const response = await request(app)
          .get('/receipts/period/test-user/test-host/2025-01-01/2025-12-31/receipt.pdf')
          .set('Authorization', 'Bearer test-token');

        expect(response.status).toBe(200);
        await snapshotPDF(response.body, 'period_receipt_effective_date.pdf');
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
