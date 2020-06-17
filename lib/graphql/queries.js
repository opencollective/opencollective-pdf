import { invoiceFields } from './fragments';
import { createClient, gqlV1, API_V1_CONTEXT, gqlV2 } from '.';

export async function fetchInvoiceByDateRange(invoiceInputType, accessToken, apiKey) {
  const query = gqlV1`
    query InvoiceByDateRange($invoiceInputType: InvoiceInputType!) {
      InvoiceByDateRange(invoiceInputType: $invoiceInputType) {
        ...InvoiceFields
      }
    }

    ${invoiceFields}
  `;
  const client = createClient(accessToken, apiKey);
  const result = await client.query({
    query,
    variables: { invoiceInputType },
    context: API_V1_CONTEXT,
    fetchPolicy: 'no-cache',
  });
  return result.data.InvoiceByDateRange;
}

/**
 * Fetch invoice for a single transaction.
 * This endpoint doesn't require authentication because we assume that the `uuid`
 * is private to the user.
 *
 * @param {string} transactionUuid
 */
export async function fetchTransactionInvoice(transactionUuid, accessToken, apiKey) {
  const query = gqlV1`
    query TransactionInvoice($transactionUuid: String!) {
      TransactionInvoice(transactionUuid: $transactionUuid) {
        ...InvoiceFields
      }
    }

    ${invoiceFields}
  `;

  const client = createClient(accessToken, apiKey);
  const result = await client.query({
    query,
    variables: { transactionUuid },
    context: API_V1_CONTEXT,
    fetchPolicy: 'no-cache',
  });
  return result.data.TransactionInvoice;
}

/**
 * Fetch expense's data to generate an invoice.
 *
 * @param {string} expenseId
 */
export async function fetchExpenseInvoiceData(expenseId, accessToken, apiKey) {
  const query = gqlV2`
    query ExpenseInvoice($expenseId: String!) {
      expense(expense: { id: $expenseId }) {
        id
        legacyId
        description
        currency
        type
        invoiceInfo
        amount
        createdAt
        account {
          id
          type
          name
          slug
          imageUrl
          location {
            address
            country
          }
          ... on Collective {
            host {
              id
              name
              slug
              type
              expensePolicy
              location {
                address
                country
              }
            }
          }
          ... on Event {
            host {
              id
              name
              slug
              type
              expensePolicy
              location {
                address
                country
              }
            }
          }
        }
        payee {
          id
          type
          name
          slug
          imageUrl
        }
        payeeLocation {
          address
          country
        }
        items {
          id
          amount
          description
          incurredAt
          url
        }
      }
    }
  `;

  const client = createClient(accessToken, apiKey);
  const result = await client.query({ query, variables: { expenseId } });
  return result.data.expense;
}
