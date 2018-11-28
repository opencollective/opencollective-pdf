import { GraphQLClient } from 'graphql-request';

export const getGraphqlUrl = () => {
  const apiKey = process.env.API_KEY;
  const baseApiUrl = process.env.API_URL || 'https://api.opencollective.com';
  return `${baseApiUrl}/graphql${apiKey ? `?api_key=${apiKey}` : ''}`;
};

function getClient(accessToken) {
  return new GraphQLClient(getGraphqlUrl(), {
    headers: { authorization: `Bearer ${accessToken}` },
  });
}

export async function fetchInvoice(invoiceSlug, accessToken) {
  const query = `
  query Invoice($invoiceSlug: String!) {
    Invoice(invoiceSlug:$invoiceSlug) {
      slug
      totalAmount
      currency
      year
      month
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
  }
  `;
  const client = getClient(accessToken);
  const result = await client.request(query, { invoiceSlug });
  return result.Invoice;
}
