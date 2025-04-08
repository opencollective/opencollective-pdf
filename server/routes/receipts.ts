import express from 'express';
import { sendPDFResponse } from '../utils/pdf';
import { authenticateRequest, AuthorizationHeaders } from '../utils/authentication';
import { gql } from '@apollo/client';
import { createClient } from '../utils/apollo-client';
import { adaptApolloError } from '../utils/apollo-client';
import ExpenseInvoice from '../components/expenses/ExpenseInvoice';
import { NotFoundError } from '../../server/utils/errors';
import { ForbiddenError } from '../../server/utils/errors';

const router = express.Router();

// By transaction ID

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

function getReceiptFromTransactionData(originalTransaction) {
  let transaction = originalTransaction;
  if (transaction.type === 'DEBIT' && transaction.oppositeTransaction && !transaction.isRefund) {
    transaction = transaction.oppositeTransaction;
  }

  const host = transaction.host;
  if (!host) {
    throw new Error('Could not find host for this transaction');
  }

  const invoiceName = transaction.invoiceTemplate || transaction.order?.tier?.invoiceTemplate;
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

export default router;
