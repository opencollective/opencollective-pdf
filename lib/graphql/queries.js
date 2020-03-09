import { invoiceFields } from './fragments';
import { createClient, gqlV1, API_V1_CONTEXT } from '.';

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
  const result = await client.query({ query, variables: { invoiceInputType }, context: API_V1_CONTEXT });
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
  const result = await client.query({ query, variables: { transactionUuid }, context: API_V1_CONTEXT });
  return result.data.TransactionInvoice;
}
