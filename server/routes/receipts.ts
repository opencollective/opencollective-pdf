import express from 'express';
import { sendPDFResponse } from '../lib/pdf';
import { authenticateRequest, AuthorizationHeaders } from '../lib/authentication';
import { gql } from '@apollo/client';
import { createClient } from '../lib/apollo-client';
import { adaptApolloError } from '../lib/apollo-client';
import { NotFoundError } from '../lib/errors';
import { ForbiddenError } from '../lib/errors';
import Receipt from 'server/components/receipts/Receipt';
import { Transaction } from 'server/graphql/types/v2/schema';
import dayjs from 'server/lib/dayjs';

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
      taxes {
        type
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
    response = await client.query({
      query,
      variables: { transactionId },
      fetchPolicy: 'no-cache',
    });
  } catch (e) {
    console.error('Query Error', JSON.stringify(e, null, 2));
    throw adaptApolloError(e);
  }

  const transaction = response.data.transaction;
  if (!transaction) {
    throw new NotFoundError(`Transaction ${transactionId} not found`);
  } else if (!transaction.permissions.canDownloadInvoice) {
    throw new ForbiddenError(`You don't have permission to download this transaction's invoice`);
  }

  return response.data.transaction;
}

function getReceiptFromTransactionData(originalTransaction: Transaction) {
  let transaction = originalTransaction;
  if (transaction.type === 'DEBIT' && transaction.oppositeTransaction && !transaction.isRefund) {
    transaction = transaction.oppositeTransaction;
  }

  const host = transaction.host;
  if (!host) {
    throw new Error('Could not find host for this transaction');
  }

  const invoiceName = transaction.invoiceTemplate || transaction.order?.tier?.invoiceTemplate || '';
  const template = host.settings?.invoice?.templates?.[invoiceName] || host?.settings?.invoice?.templates?.default;
  const fromAccount = transaction.isRefund ? transaction.toAccount : transaction.fromAccount;
  return {
    isRefundOnly: transaction.isRefund,
    currency: transaction.amountInHostCurrency.currency,
    totalAmount: transaction.amountInHostCurrency.valueInCents,
    transactions: [transaction],
    host,
    fromAccount: fromAccount,
    fromAccountHost: fromAccount.host,
    template,
  };
}

router.options('/transaction/:id/:filename.pdf', (req, res) => {
  res.sendStatus(204);
});

router.get('/transaction/:id/:filename.pdf', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const authorizationHeaders = authenticateRequest(req);
  const transaction = await fetchTransactionInvoice(id, authorizationHeaders);
  await sendPDFResponse(res, Receipt, { receipt: getReceiptFromTransactionData(transaction) });
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
        kind: [CONTRIBUTION, PLATFORM_TIP]
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
  const { data } = await client.query({
    query,
    variables: { fromCollectiveSlug, hostSlug, dateFrom, dateTo, hasExpense },
    fetchPolicy: 'no-cache',
  });

  if (!data.host) {
    throw new NotFoundError(`Host ${hostSlug} doesn't exist`);
  } else if (!data.fromAccount) {
    throw new NotFoundError(`Account ${fromCollectiveSlug} doesn't exist`);
  } else if (!data.fromAccount.permissions.canDownloadPaymentReceipts.allowed) {
    throw new ForbiddenError(`You don't have permission to download this account's payment receipts`);
  }

  return data;
}

const validateReceiptPeriodParams = (req: express.Request) => {
  const { contributorSlug, hostSlug, dateFrom, dateTo } = req.params;
  if (!contributorSlug) {
    throw new Error('Contributor slug is required');
  } else if (!hostSlug) {
    throw new Error('Host slug is required');
  } else if (!dateFrom || !dateTo) {
    throw new Error('Date range is required');
  } else if (!dayjs(dateFrom).isValid() || !dayjs(dateTo).isValid()) {
    throw new Error('Invalid date range');
  }
};

router.options('/period/:contributorSlug/:hostSlug/:dateFrom/:dateTo/:filename.pdf', (req, res) => {
  validateReceiptPeriodParams(req);
  res.sendStatus(204);
});

router.get(
  '/period/:contributorSlug/:hostSlug/:dateFrom/:dateTo/:filename.pdf',
  async (req: express.Request, res: express.Response) => {
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

    if (response.transactions.totalCount > response.transactions.nodes.length) {
      throw new Error('Too many transactions. Please contact support');
    }

    const invoiceTemplateObj =
      await response.host?.settings?.invoice?.templates?.[
        response.transactions[0]?.invoiceTemplate || response.transactions[0]?.order?.tier?.invoiceTemplate
      ];

    const template = invoiceTemplateObj || response.host.settings?.invoice?.templates?.default;
    await sendPDFResponse(res, Receipt, {
      receipt: {
        totalAmount: response.transactions.nodes.reduce(
          (total: number, t: Transaction) => total + (t.amountInHostCurrency.valueInCents || 0),
          0,
        ),
        currency: response.host.currency,
        transactions: response.transactions.nodes,
        host: response.host,
        fromAccount: response.fromAccount,
        fromAccountHost: response.fromAccount.host,
        dateFrom,
        dateTo,
        template,
      },
    });
  },
);

export default router;
