import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql/language/printer';
import gql from 'graphql-tag';

const getGraphqlUrl = () => {
  const apiKey = process.env.API_KEY;
  const baseApiUrl = process.env.API_URL || 'https://api.opencollective.com';
  return `${baseApiUrl}/graphql${apiKey ? `?api_key=${apiKey}` : ''}`;
};

const getClient = (accessToken, apiKey) => {
  const headers = {};

  if (accessToken) {
    headers['authorization'] = `Bearer ${accessToken}`;
  } else if (apiKey) {
    headers['Api-Key'] = apiKey;
  }

  return new GraphQLClient(getGraphqlUrl(), { headers });
};

const invoiceFields = gql`
  fragment InvoiceFields on InvoiceType {
    title
    slug
    dateFrom
    dateTo
    totalAmount
    currency
    year
    month
    day
    host {
      id
      slug
      name
      image
      website
      settings
      type
      location {
        name
        address
        country
      }
    }
    fromCollective {
      id
      slug
      name
      currency
      type
      location {
        name
        address
        country
      }
    }
    transactions {
      id
      createdAt
      description
      amount
      currency
      type
      hostCurrency
      netAmountInCollectiveCurrency
      taxAmount
      fromCollective {
        id
        slug
        name
        type
      }
      usingVirtualCardFromCollective {
        id
        slug
        name
        type
      }
      collective {
        id
        slug
        name
        type
      }
      ... on Order {
        order {
          id
          quantity
          tier {
            id
            type
          }
        }
      }
    }
  }
`;

export async function fetchInvoiceByDateRange(invoiceInputType, accessToken, apiKey) {
  const query = gql`
    query InvoiceByDateRange($invoiceInputType: InvoiceInputType!) {
      InvoiceByDateRange(invoiceInputType: $invoiceInputType) {
        ...InvoiceFields
      }
    }

    ${invoiceFields}
  `;
  const client = getClient(accessToken, apiKey);
  const result = await client.request(print(query), { invoiceInputType });
  return result.InvoiceByDateRange;
}

export async function fetchInvoice(invoiceSlug, accessToken, apiKey) {
  const query = gql`
    query Invoice($invoiceSlug: String!) {
      Invoice(invoiceSlug: $invoiceSlug) {
        ...InvoiceFields
      }
    }

    ${invoiceFields}
  `;
  const client = getClient(accessToken, apiKey);
  const result = await client.request(print(query), { invoiceSlug });
  return result.Invoice;
}

/**
 * Fetch invoice for a single transaction.
 * This endpoint doesn't require authentication because we assume that the `uuid`
 * is private to the user.
 *
 * @param {string} transactionUuid
 */
export async function fetchTransactionInvoice(transactionUuid, accessToken, apiKey) {
  const query = gql`
    query TransactionInvoice($transactionUuid: String!) {
      TransactionInvoice(transactionUuid: $transactionUuid) {
        ...InvoiceFields
      }
    }

    ${invoiceFields}
  `;

  const client = getClient(accessToken, apiKey);
  const result = await client.request(print(query), { transactionUuid });
  return result.TransactionInvoice;
}
