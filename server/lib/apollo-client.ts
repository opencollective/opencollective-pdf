import http from 'http';
import https from 'https';

import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { parseToBooleanDefaultTrue } from './env';

import { get, has } from 'lodash-es';
import { AuthorizationHeaders } from './authentication';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  PDFServiceError,
  UnauthorizedError,
} from './errors';

export const adaptApolloError = (error: unknown) => {
  if (error instanceof PDFServiceError) {
    return error;
  }

  const status: string | number | undefined =
    get(error, 'networkError.statusCode') || get(error, 'graphQLErrors[0].extensions.code');
  const message = get(error, 'networkError.result.error.message') || get(error, 'graphQLErrors[0].message');

  if (status === undefined || (!status && !message)) {
    if (has(error, 'networkError')) {
      return new InternalServerError('Connection error');
    } else {
      return new InternalServerError('Unknown error');
    }
  }

  switch (status) {
    case 400:
    case 'BadRequest':
      return new BadRequestError(message);
    case 401:
      return new UnauthorizedError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 500:
      return new InternalServerError(message);
    default:
      return new InternalServerError(message);
  }
};

/**
 * Returns the GraphQL api url for the appropriate api version and environment.
 * @param {string} version - api version.
 * @returns {string} GraphQL api url.
 */
const getGraphqlUrl = (apiVersion: 'v1' | 'v2') => {
  const apiKey = process.env.API_KEY;
  const baseApiUrl = process.env.API_URL || 'https://api.opencollective.com';
  return `${baseApiUrl}/graphql/${apiVersion}${apiKey ? `?api_key=${apiKey}` : ''}`;
};

async function customFetch(url: URL | RequestInfo, options: any = {}) {
  options.agent = getCustomAgent();

  // Add headers to help the API identify origin of requests
  options.headers = options.headers || {};
  options.headers['oc-env'] = process.env.OC_ENV || process.env.NODE_ENV || 'development';
  // options.headers['oc-secret'] = process.env.OC_SECRET; // TODO
  options.headers['oc-application'] = 'pdf';
  options.headers['user-agent'] = 'opencollective-pdf/1.0 node-fetch/1.0';

  const result = await fetch(url, options);
  return result;
}

let customAgent: ((parsedURL: URL) => http.Agent) | undefined;

function getCustomAgent() {
  if (!customAgent) {
    const { FETCH_AGENT_KEEP_ALIVE, FETCH_AGENT_KEEP_ALIVE_MSECS } = process.env;
    const keepAlive = FETCH_AGENT_KEEP_ALIVE !== undefined ? parseToBooleanDefaultTrue(FETCH_AGENT_KEEP_ALIVE) : true;
    const keepAliveMsecs = FETCH_AGENT_KEEP_ALIVE_MSECS ? Number(FETCH_AGENT_KEEP_ALIVE_MSECS) : 10000;
    const httpAgent = new http.Agent({ keepAlive, keepAliveMsecs });
    const httpsAgent = new https.Agent({ keepAlive, keepAliveMsecs });
    customAgent = _parsedURL => (_parsedURL.protocol === 'http:' ? httpAgent : httpsAgent);
  }
  return customAgent;
}

export const createClient = (authorizationHeaders: AuthorizationHeaders) => {
  const authLink = setContext((_, { headers }) => {
    const newHeaders = { ...headers, ...authorizationHeaders };
    return { headers: newHeaders };
  });

  const apiLink = new HttpLink({
    uri: getGraphqlUrl('v2'),
    fetch: customFetch,
  });

  return new ApolloClient({
    ssrMode: true, // Disables forceFetch on the server (so queries are only run once)
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
