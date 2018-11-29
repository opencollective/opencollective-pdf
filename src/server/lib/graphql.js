import { GraphQLClient } from 'graphql-request';

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

const invoiceFields = `
  slug
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
`;

export async function fetchInvoice(invoiceSlug, accessToken) {
  const query = `
  query Invoice($invoiceSlug: String!) {
    Invoice(invoiceSlug:$invoiceSlug) {
      ${invoiceFields}
    }
  }
  `;
  const client = getClient(accessToken);
  const result = await client.request(query, { invoiceSlug });
  return result.Invoice;
}

export async function fetchTransactionInvoice(transactionUuid, accessToken) {
  const query = `
  query TransactionInvoice($transactionUuid: String!) {
    TransactionInvoice(transactionUuid: $transactionUuid) {
      ${invoiceFields}
    }
  }
  `;

  const client = getClient(accessToken);
  const result = await client.request(query, { transactionUuid });
  return result.TransactionInvoice;
}
