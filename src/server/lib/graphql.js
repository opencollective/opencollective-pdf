import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql/language/printer';
import gql from 'graphql-tag';

const getGraphqlUrl = () => {
  const apiKey = process.env.API_KEY;
  const baseApiUrl = process.env.API_URL || 'https://api.opencollective.com';
  return `${baseApiUrl}/graphql${apiKey ? `?api_key=${apiKey}` : ''}`;
};

const getClient = accessToken => {
  return new GraphQLClient(getGraphqlUrl(), {
    headers: { authorization: `Bearer ${accessToken}` },
  });
};

const invoiceFields = gql`
  fragment InvoiceFields on InvoiceType {
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
      }
      countryISO
    }
    fromCollective {
      id
      slug
      name
      currency
      location {
        name
        address
      }
      countryISO
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
      }
      usingVirtualCardFromCollective {
        id
        slug
        name
      }
      collective {
        id
        slug
        name
      }
    }
  }
`;

export async function fetchInvoiceByDateRange(invoiceInputType, accessToken) {
  const query = gql`
    query InvoiceByDateRange($invoiceInputType: InvoiceInputType!) {
      InvoiceByDateRange(invoiceInputType: $invoiceInputType) {
        ...InvoiceFields
      }
    }

    ${invoiceFields}
  `;
  const client = getClient(accessToken);
  const result = await client.request(print(query), { invoiceInputType });
  return result.InvoiceByDateRange;
}
export async function fetchInvoice(invoiceSlug, accessToken) {
  const query = gql`
    query Invoice($invoiceSlug: String!) {
      Invoice(invoiceSlug: $invoiceSlug) {
        ...InvoiceFields
      }
    }

    ${invoiceFields}
  `;
  const client = getClient(accessToken);
  const result = await client.request(print(query), { invoiceSlug });
  return result.Invoice;
}

export async function fetchTransactionInvoice(transactionUuid, accessToken) {
  const query = gql`
    query TransactionInvoice($transactionUuid: String!) {
      TransactionInvoice(transactionUuid: $transactionUuid) {
        ...InvoiceFields
      }
    }

    ${invoiceFields}
  `;

  const client = getClient(accessToken);
  const result = await client.request(print(query), { transactionUuid });
  return result.TransactionInvoice;
}
