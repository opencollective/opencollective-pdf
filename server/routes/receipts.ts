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

const router = express.Router();
const CONTRIBUTION_KIND = 'CONTRIBUTION';
const PLATFORM_TIP_KIND = 'PLATFORM_TIP';
const CREDIT_TYPE = 'CREDIT';

type ReceiptTransaction = React.ComponentProps<typeof Receipt>['receipt']['transactions'][number] & {
  type?: string;
  host?: {
    settings?: {
      singleReceiptPlatformTip?: boolean | null;
    } | null;
  } | null;
  relatedTransactions?: Array<ReceiptTransaction | null> | null;
  fromAccount?: unknown;
  taxInfo?: unknown;
  data?: Record<string, unknown>;
};

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

const receiptTransactionLineFragment = gql`
  fragment ReceiptTransactionLineFragment on Transaction {
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

const receiptTransactionFragment = gql`
  fragment ReceiptTransactionFragment on Transaction {
    ...ReceiptTransactionLineFragment
    relatedTransactions(kind: [CONTRIBUTION, PLATFORM_TIP]) {
      ...ReceiptTransactionLineFragment
    }
  }
  ${receiptTransactionLineFragment}
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
    console.error('Query Error', JSON.stringify(e, null, 2));
    throw adaptApolloError(e);
  }

  if (response.error) {
    throw adaptApolloError(response.error);
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

  return response.data.transaction as QueryResult<TransactionInvoiceQuery>['data']['transaction'];
}

const findRelatedContribution = (transaction: ReceiptTransaction) => {
  return transaction.relatedTransactions?.find(t => t?.kind === CONTRIBUTION_KIND && t.type === transaction.type);
};

const findRelatedPlatformTip = (transaction: ReceiptTransaction) => {
  return transaction.relatedTransactions?.find(t => t?.kind === PLATFORM_TIP_KIND && t.type === CREDIT_TYPE);
};

const hasSingleReceiptPlatformTipFeature = (transaction: ReceiptTransaction) => {
  return transaction.host?.settings?.singleReceiptPlatformTip === true;
};

const getPlatformTipLineItem = (
  transaction: ReceiptTransaction,
  platformTip = findRelatedPlatformTip(transaction),
): ReceiptTransaction | null => {
  if (transaction.kind !== CONTRIBUTION_KIND || !platformTip) {
    return null;
  }

  return {
    ...platformTip,
    description: 'Contribution to the Open Collective platform',
    host: transaction.host,
    fromAccount: transaction.fromAccount,
    amountInHostCurrency: {
      valueInCents: Math.round(platformTip.amount.valueInCents * (transaction.hostCurrencyFxRate || 1)),
      currency: transaction.amountInHostCurrency.currency,
    },
    hostCurrency: transaction.amountInHostCurrency.currency,
    taxAmount: {
      valueInCents: 0,
      currency: transaction.amountInHostCurrency.currency,
    },
    taxInfo: null,
    hostCurrencyFxRate: transaction.hostCurrencyFxRate,
    order: {
      ...platformTip.order,
      quantity: 1,
    },
    data: {
      ...platformTip.data,
      isReceiptPlatformTip: true,
    },
  };
};

const getReceiptTransactions = (transactions: ReceiptTransaction[]) => {
  return transactions.flatMap(transaction => {
    if (transaction.kind === PLATFORM_TIP_KIND) {
      const relatedContribution = findRelatedContribution(transaction);
      if (!relatedContribution || !hasSingleReceiptPlatformTipFeature(relatedContribution)) {
        return [transaction];
      }

      // For opted-in hosts, direct tip receipt downloads should render the same host-issued
      // receipt as the contribution download, with the tip moved into its own line item.
      return [relatedContribution, getPlatformTipLineItem(relatedContribution, transaction)].filter(Boolean);
    } else if (transaction.kind === CONTRIBUTION_KIND && hasSingleReceiptPlatformTipFeature(transaction)) {
      return [transaction, getPlatformTipLineItem(transaction)].filter(Boolean);
    } else {
      // Keep legacy standalone platform-tip receipts for hosts that have not opted in yet.
      return [transaction];
    }
  }) as ReceiptTransaction[];
};

const getReceiptTotalAmount = (transactions: ReceiptTransaction[]) => {
  return transactions.reduce((total, transaction) => total + (transaction.amountInHostCurrency.valueInCents || 0), 0);
};

function getReceiptFromTransactionData(
  originalTransaction: NonNullable<NonNullable<QueryResult<TransactionInvoiceQuery>['data']>['transaction']>,
): React.ComponentProps<typeof Receipt>['receipt'] {
  let transaction = originalTransaction;
  if (transaction.type === 'DEBIT' && transaction.oppositeTransaction && !transaction.isRefund) {
    transaction = transaction.oppositeTransaction as typeof transaction;
  }

  const receiptTransactions = getReceiptTransactions([transaction as unknown as ReceiptTransaction]);
  const primaryTransaction = receiptTransactions[0];
  if (!primaryTransaction) {
    throw new Error('Could not find transaction for this receipt');
  }

  // When a platform-tip URL resolves to a combined receipt, the contribution becomes the
  // primary transaction so the receipt is issued by the contribution host, not OFiTech.
  transaction = primaryTransaction as unknown as typeof transaction;

  const host = transaction.host;
  if (!host) {
    throw new Error('Could not find host for this transaction');
  }

  const invoiceName = transaction.invoiceTemplate || transaction.order?.tier?.invoiceTemplate || '';
  const template = host.settings?.invoice?.templates?.[invoiceName] || host?.settings?.invoice?.templates?.default;
  const fromAccount = transaction.isRefund ? transaction.toAccount : transaction.fromAccount;
  return {
    isRefundOnly: transaction.isRefund,
    currency: transaction.amountInHostCurrency.currency as NonNullable<string>,
    totalAmount: getReceiptTotalAmount(receiptTransactions),
    transactions: receiptTransactions,
    host,
    fromAccount: fromAccount as NonNullable<typeof fromAccount>,
    fromAccountHost: (fromAccount as unknown as AccountWithHost)?.host,
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
  } else if (!response.data.host) {
    throw new NotFoundError(`Host ${hostSlug} doesn't exist`);
  } else if (!response.data.fromAccount) {
    throw new NotFoundError(`Account ${fromCollectiveSlug} doesn't exist`);
  } else if (!response.data.fromAccount.permissions.canDownloadPaymentReceipts.allowed) {
    throw new ForbiddenError(`You don't have permission to download this account's payment receipts`);
  }

  return response.data as QueryResult<InvoiceByDateRangeQuery>['data'];
}

const validateReceiptPeriodParams = (req: express.Request) => {
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

router.get(
  '/period/:contributorSlug/:hostSlug/:dateFrom/:dateTo/:filename.pdf',
  async (req: express.Request, res: express.Response) => {
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

    if (response.transactions.totalCount > response.transactions.nodes.length) {
      throw new InternalServerError('Too many transactions. Please contact support');
    }

    const invoiceTemplateObj =
      await response.host?.settings?.invoice?.templates?.[
        response.transactions[0]?.invoiceTemplate || response.transactions[0]?.order?.tier?.invoiceTemplate
      ];

    const template = invoiceTemplateObj || response.host.settings?.invoice?.templates?.default;
    const receiptTransactions = getReceiptTransactions(response.transactions.nodes as unknown as ReceiptTransaction[]);
    await sendPDFResponse(res, Receipt, {
      receipt: {
        totalAmount: getReceiptTotalAmount(receiptTransactions),
        currency: response.host.currency,
        transactions: receiptTransactions,
        host: response.host,
        fromAccount: response.fromAccount,
        fromAccountHost: (response.fromAccount as unknown as AccountWithHost).host,
        dateFrom,
        dateTo,
        template,
      },
    });
  },
);

export default router;
