import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import fetch from 'cross-fetch';

/**
 * Returns the GraphQL api url for the appropriate api version and environment.
 * @param {string} version - api version.
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

  const apiLink = new HttpLink({ uri: getGraphqlUrl('v2'), fetch });
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([authLink, apiLink]),
    cache: new InMemoryCache({
      // Documentation:
      // https://www.apollographql.com/docs/react/data/fragments/#using-fragments-with-unions-and-interfaces
      possibleTypes: {
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
