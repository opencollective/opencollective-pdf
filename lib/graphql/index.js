import { ApolloClient, gql, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import fetch from 'cross-fetch';

/**
 * Returns the GraphQL api url for the appropriate api version and environment.
 * @param {string} version - api version. Defaults to v1.
 * @returns {string} GraphQL api url.
 */
const getGraphqlUrl = (apiVersion) => {
  const apiKey = process.env.API_KEY;
  const baseApiUrl = process.env.API_URL || 'https://api.opencollective.com';
  return `${baseApiUrl}/graphql/${apiVersion}${apiKey ? `?api_key=${apiKey}` : ''}`;
};

export const createClient = (accessToken, apiKey) => {
  const authLink = setContext((_, { headers }) => {
    const newHeaders = { ...headers };

    if (accessToken) {
      newHeaders['authorization'] = `Bearer ${accessToken}`;
    } else if (apiKey) {
      newHeaders['Api-Key'] = apiKey;
    }

    return { headers: newHeaders };
  });

  // Depending on the value of the context.apiVersion we choose to use the link for the api
  // v1 or the api v2.
  const apiV1Link = new HttpLink({ uri: getGraphqlUrl('v1'), fetch });
  const apiV2Link = new HttpLink({ uri: getGraphqlUrl('v2'), fetch });
  const isV1Operation = (operation) => operation.getContext().apiVersion === '1';
  const httpLink = ApolloLink.split(isV1Operation, apiV1Link, apiV2Link);

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache({
      // Documentation:
      // https://www.apollographql.com/docs/react/data/fragments/#using-fragments-with-unions-and-interfaces
      possibleTypes: {
        Transaction: ['Expense', 'Order'],
        CollectiveInterface: ['Collective', 'Event', 'Project', 'Fund', 'Organization', 'User', 'Vendor'],
        Account: ['Collective', 'Host', 'Individual', 'Fund', 'Project', 'Bot', 'Event', 'Organization', 'Vendor'],
        AccountWithHost: ['Collective', 'Event', 'Fund', 'Project'],
        AccountWithContributions: ['Collective', 'Event', 'Fund', 'Project', 'Host'],
      },
      // Documentation:
      // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-non-normalized-objects
      typePolicies: {
        Event: {
          fields: {
            tiers: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
};

/** A wrapper arround `gql` to ensure linter applies API v1 schema */
export const gqlV1 = gql;
export const gqlV2 = gql;

/** To pass as a context to your query/mutation to use API v1 */
export const API_V1_CONTEXT = { apiVersion: '1' };
