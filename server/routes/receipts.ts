import express from 'express';
import { sendPDFResponse } from '../lib/pdf.js';
import { authenticateRequest, AuthorizationHeaders } from '../lib/authentication.js';
import { gql, QueryResult } from '@apollo/client/index.js';
import { createClient } from '../lib/apollo-client.js';
import { adaptApolloError } from '../lib/apollo-client.js';
import { BadRequestError, InternalServerError, NotFoundError } from '../lib/errors.js';
import { ForbiddenError } from '../lib/errors.js';
import Receipt from '../components/receipts/Receipt.js';
import { AccountWithHost } from '../graphql/types/v2/graphql.js';
import dayjs from '../lib/dayjs.js';
import { InvoiceByDateRangeQuery, TransactionInvoiceQuery } from '../graphql/types/v2/graphql.js';
import { parseToBoolean } from '../lib/env.js';
import { loadEmbeddedImage } from '../lib/images.js';
import { getInvoiceTemplate } from '../lib/invoice-templates.js';

const router = express.Router();

// ---- By transaction ID ----

const receiptTransactionHostFieldsFragment = gql`
  fragment ReceiptTransactionHostFieldsFragment on Account {
    id
    slug
    name
    legalName
    currency
    imageUrl(height: 200)
    website
    settings
    type
    location {
      name
      address
      country
    }
  }
`;

const receiptTransactionFragment = gql`
  fragment ReceiptTransactionFragment on Transaction {
    id
    type
    kind
    createdAt
    clearedAt
    description
    hostCurrencyFxRate
    invoiceTemplate
    isRefund
    host {
      ...ReceiptTransactionHostFieldsFragment
    }
    oppositeTransaction {
      host {
        ...ReceiptTransactionHostFieldsFragment
      }
    }
    amount {
      valueInCents
      currency
    }
    amountInHostCurrency {
      valueInCents
      currency
    }
    netAmount {
      valueInCents
      currency
    }
    taxAmount {
      valueInCents
      currency
    }
    taxInfo {
      type
      rate
    }
    type
    paymentMethod {
      id
      type
      service
      name
    }
    fromAccount {
      id
      slug
      name
      legalName
      type
      settings
      location {
        name
        address
        country
      }
      ... on AccountWithHost {
        host {
          id
          name
          legalName
          slug
          type
          expensePolicy
          settings
          location {
            address
            country
          }
        }
      }
    }
    toAccount {
      id
      slug
      legalName
      name
      type
      settings
      location {
        name
        address
        country
      }
      ... on Event {
        startsAt
        endsAt
        timezone
      }
    }
    giftCardEmitterAccount {
      id
      slug
      name
      legalName
      type
    }
    isRefund
    refundTransaction {
      id
    }
    order {
      id
      legacyId
      data
      tax {
        id
        type
        rate
        percentage
      }
      quantity
      tier {
        id
        type
        invoiceTemplate
      }
    }
  }
  ${receiptTransactionHostFieldsFragment}
`;

async function fetchTransactionInvoice(transactionId: string, authorizationHeaders: AuthorizationHeaders) {
  const query = gql`
    query TransactionInvoice($transactionId: String!) {
      transaction(id: $transactionId) {
        id
        type
        kind
        permissions {
          canDownloadInvoice
        }
        ...ReceiptTransactionFragment
        ... on Debit {
          oppositeTransaction {
            id
            type
            kind
            permissions {
              canDownloadInvoice
            }
            ...ReceiptTransactionFragment
          }
        }
      }
    }
    ${receiptTransactionFragment}
  `;

  const client = createClient(authorizationHeaders);
  let response;
  try {
    response = await client.query<TransactionInvoiceQuery>({
      query,
      variables: { transactionId },
      fetchPolicy: 'no-cache',
    });
  } catch (e) {
    throw adaptApolloError(e);
  }

  if (response.error) {
    throw adaptApolloError(response.error);
  }

  if (!response.data) {
    throw new Error('Missing response data'); // This used to fail on a TypeError
  }

  const transaction = response.data.transaction;
  if (!transaction) {
    throw new NotFoundError(`Transaction ${transactionId} not found`);
  } else if (!transaction.permissions.canDownloadInvoice) {
    throw new ForbiddenError(`You don't have permission to download this transaction's invoice`);
  }

  if (parseToBoolean(process.env.DEBUG_RECEIPTS_GQL)) {
    console.log('Query Response', JSON.stringify(response.data));
  }

  return transaction;
}

function getReceiptFromTransactionData(
  originalTransaction: NonNullable<NonNullable<QueryResult<TransactionInvoiceQuery>['data']>['transaction']>,
): React.ComponentProps<typeof Receipt>['receipt'] {
  let transaction = originalTransaction;
  if (transaction.type === 'DEBIT' && transaction.oppositeTransaction && !transaction.isRefund) {
    transaction = transaction.oppositeTransaction as typeof transaction;
  }

  const host = transaction.host;
  if (!host) {
    throw new Error('Could not find host for this transaction');
  }

  const invoiceName = transaction.invoiceTemplate || transaction.order?.tier?.invoiceTemplate || '';
  const template = getInvoiceTemplate(host.settings, invoiceName, host.slug);
  const fromAccount = transaction.isRefund ? transaction.toAccount : transaction.fromAccount;
  return {
    isRefundOnly: transaction.isRefund,
    currency: transaction.amountInHostCurrency.currency as NonNullable<string>,
    totalAmount: transaction.amountInHostCurrency.valueInCents as NonNullable<number>,
    transactions: [transaction] as unknown as React.ComponentProps<typeof Receipt>['receipt']['transactions'],
    host,
    fromAccount: fromAccount as NonNullable<typeof fromAccount>,
    fromAccountHost: (fromAccount as unknown as AccountWithHost)?.host,
    template,
  };
}

// Fully transparent 1x1 PNG, used in place of embedded images that could not be loaded so that the
// document layout stays the same as when the image is missing.
const TRANSPARENT_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=';

/**
 * Replaces the invoice template's embedded image (user-provided) with a validated PNG/JPEG data URL.
 * The host logo doesn't need this: it always goes through the images proxy, which converts it to PNG/JPEG.
 */
async function loadReceiptEmbeddedImage(
  receipt: React.ComponentProps<typeof Receipt>['receipt'],
): Promise<React.ComponentProps<typeof Receipt>['receipt']> {
  if (!receipt.template?.embeddedImage) {
    return receipt;
  }

  const embeddedImage = await loadEmbeddedImage(receipt.template.embeddedImage);
  return { ...receipt, template: { ...receipt.template, embeddedImage: embeddedImage || TRANSPARENT_PIXEL } };
}

router.options('/transaction/:id/:filename.pdf', (req, res) => {
  res.sendStatus(204);
});

router.get('/transaction/:id/:filename.pdf', async (req, res) => {
  const { id } = req.params;
  const authorizationHeaders = authenticateRequest(req);
  const transaction = await fetchTransactionInvoice(id, authorizationHeaders);
  const receipt = await loadReceiptEmbeddedImage(getReceiptFromTransactionData(transaction));
  await sendPDFResponse(res, Receipt, { receipt });
});

// ---- By period ----

async function fetchInvoiceByDateRange(
  {
    fromCollectiveSlug,
    hostSlug,
    dateFrom,
    dateTo,
    hasExpense,
  }: {
    fromCollectiveSlug: string;
    hostSlug: string;
    dateFrom: string;
    dateTo: string;
    hasExpense?: boolean;
  },
  authorizationHeaders: AuthorizationHeaders,
) {
  const query = gql`
    query InvoiceByDateRange(
      $fromCollectiveSlug: String!
      $hostSlug: String!
      $dateFrom: DateTime!
      $dateTo: DateTime!
      $hasExpense: Boolean
    ) {
      host(slug: $hostSlug) {
        ...ReceiptTransactionHostFieldsFragment
      }
      fromAccount: account(slug: $fromCollectiveSlug) {
        id
        slug
        name
        legalName
        currency
        type
        permissions {
          canDownloadPaymentReceipts {
            allowed
          }
        }
        settings
        location {
          name
          address
          country
        }
      }
      transactions(
        fromAccount: { slug: $fromCollectiveSlug }
        host: { slug: $hostSlug }
        dateFrom: $dateFrom
        dateTo: $dateTo
        limit: 1000
        includeIncognitoTransactions: true
        includeGiftCardTransactions: true
        hasExpense: $hasExpense
        kind: [CONTRIBUTION, PLATFORM_TIP, ADDED_FUNDS]
      ) {
        totalCount
        nodes {
          ...ReceiptTransactionFragment
        }
      }
    }
    ${receiptTransactionFragment}
    ${receiptTransactionHostFieldsFragment}
  `;

  const client = createClient(authorizationHeaders);
  let response;

  try {
    response = await client.query<InvoiceByDateRangeQuery>({
      query,
      variables: { fromCollectiveSlug, hostSlug, dateFrom, dateTo, hasExpense },
      fetchPolicy: 'no-cache',
    });
  } catch (e) {
    throw adaptApolloError(e);
  }

  if (response.error) {
    throw adaptApolloError(response.error);
  } else if (!response.data) {
    throw new Error('Missing response data'); // This used to fail on a TypeError
  } else if (!response.data.host) {
    throw new NotFoundError(`Host ${hostSlug} doesn't exist`);
  } else if (!response.data.fromAccount) {
    throw new NotFoundError(`Account ${fromCollectiveSlug} doesn't exist`);
  } else if (!response.data.fromAccount.permissions.canDownloadPaymentReceipts.allowed) {
    throw new ForbiddenError(`You don't have permission to download this account's payment receipts`);
  }

  // Narrow `host` and `fromAccount`, which we checked above
  return { ...response.data, host: response.data.host, fromAccount: response.data.fromAccount };
}

const validateReceiptPeriodParams = (
  req: express.Request<{ contributorSlug: string; hostSlug: string; dateFrom: string; dateTo: string }>,
) => {
  const { contributorSlug, hostSlug, dateFrom, dateTo } = req.params;
  if (!contributorSlug) {
    throw new BadRequestError('Contributor slug is required');
  } else if (!hostSlug) {
    throw new BadRequestError('Host slug is required');
  } else if (!dateFrom || !dateTo) {
    throw new BadRequestError('Date range is required');
  } else if (!dayjs(dateFrom).isValid() || !dayjs(dateTo).isValid()) {
    throw new BadRequestError('Invalid date range');
  }
};

router.options('/period/:contributorSlug/:hostSlug/:dateFrom/:dateTo/:filename.pdf', (req, res) => {
  validateReceiptPeriodParams(req);
  res.sendStatus(204);
});

router.get('/period/:contributorSlug/:hostSlug/:dateFrom/:dateTo/:filename.pdf', async (req, res) => {
  validateReceiptPeriodParams(req);
  const { contributorSlug, hostSlug, dateFrom, dateTo } = req.params;
  const authorizationHeaders = authenticateRequest(req);
  const response = await fetchInvoiceByDateRange(
    {
      fromCollectiveSlug: contributorSlug,
      hostSlug,
      dateFrom,
      dateTo,
    },
    authorizationHeaders,
  );

  const transactionNodes = response.transactions.nodes;
  if (!transactionNodes) {
    throw new Error('Missing transactions nodes'); // This used to fail on a TypeError
  } else if ((response.transactions.totalCount ?? 0) > transactionNodes.length) {
    throw new InternalServerError('Too many transactions. Please contact support');
  }

  // FIXME: `response.transactions` is a collection, not an array, so `firstTransaction` is always undefined and no
  // specific template is ever picked here. It should be `response.transactions.nodes[0]`. Kept as is to preserve the
  // current behavior.
  const firstTransaction = (response.transactions as { [index: number]: (typeof transactionNodes)[number] })[0];
  const template = getInvoiceTemplate(
    response.host.settings,
    firstTransaction?.invoiceTemplate || firstTransaction?.order?.tier?.invoiceTemplate,
    response.host.slug,
  );
  const receipt = await loadReceiptEmbeddedImage({
    totalAmount: transactionNodes.reduce((total, t) => {
      if (!t) {
        throw new Error('Unexpected null transaction'); // This used to fail on a TypeError
      }
      return total + (t.amountInHostCurrency.valueInCents || 0);
    }, 0),
    currency: response.host.currency,
    transactions: transactionNodes as unknown as React.ComponentProps<typeof Receipt>['receipt']['transactions'],
    host: response.host,
    fromAccount: response.fromAccount,
    fromAccountHost: (response.fromAccount as unknown as AccountWithHost).host,
    dateFrom,
    dateTo,
    template,
  });

  await sendPDFResponse(res, Receipt, { receipt });
});

export default router;
