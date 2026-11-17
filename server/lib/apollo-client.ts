import http from 'http';
import https from 'https';

import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client/index.js';
import { setContext } from '@apollo/client/link/context/index.js';
import { parseToBooleanDefaultTrue } from './env.js';

import { get, has } from 'lodash-es';
import { AuthorizationHeaders } from './authentication.js';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  PDFServiceError,
  UnauthorizedError,
} from './errors.js';

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
 *
 * The URL deliberately carries no credentials. API_KEY used to be appended here as
 * `?api_key=…`, which put it in every URL the API logs: Heroku router logs, the API's
 * access logs and Hyperwatch (Open Collective Watch), which keeps request URLs in its
 * history and persistence. It is now sent in the request body, see `addApiKeyToBody`.
 *
 * @param {string} version - api version.
 * @returns {string} GraphQL api url.
 */
export const getGraphqlUrl = (apiVersion: 'v1' | 'v2') => {
  const baseApiUrl = process.env.API_URL || 'https://api.opencollective.com';
  return `${baseApiUrl}/graphql/${apiVersion}`;
};

/**
 * Adds API_KEY to the JSON body of a GraphQL request, as `api_key`.
 *
 * What API_KEY is: the internal key shared by Open Collective's own services
 * (`config.keys.opencollective.apiKey` in the API). It identifies the PDF service as
 * one of our apps, not a user. A matching key:
 * - passes `authorizeClient` (server/middleware/authentication.ts in the API), which
 *   rejects a wrong key with 401 "Invalid API key" and lets a missing one through;
 * - exempts the request from the GraphQL rate limit (the `whitelist` of the limiter in
 *   server/routes.ts), which otherwise allows 10 requests per minute per IP for
 *   anonymous requests. That's why the PDF service, rendering many receipts and
 *   invoices from a few dyno IPs, needs it.
 *
 * Why the body, and not a header: the API reads the key from `?api_key` / `?apiKey`
 * in the URL, from an `Api-Key` header or from `api_key` in the body. But the
 * `Api-Key` header is also read by `checkPersonalToken`, which runs first and looks it
 * up as a *personal token*: our app key isn't one, so the request fails with 401
 * "Invalid Personal Token (Api Key)". The rate limit whitelist doesn't read headers at
 * all. The body is read by both `authorizeClient` and the whitelist, and by nothing
 * else, and Apollo Server ignores the extra field (checked against the staging API:
 * valid key 200, wrong key 401 "Invalid API key").
 *
 * The user's own credentials, when a request is made on their behalf, stay in the
 * headers set by `createClient` (`authorizationHeaders`); they're not affected.
 *
 * @param body - the request body built by Apollo's HttpLink: a JSON string.
 * @param apiKey - defaults to process.env.API_KEY; a parameter for tests.
 * @returns the body with `api_key` added, or the body unchanged when there is no key,
 *   no body, or a body that isn't a single JSON object.
 */
export const addApiKeyToBody = (body: unknown, apiKey = process.env.API_KEY) => {
  // No key configured (local development against a local API): send nothing
  if (!apiKey || typeof body !== 'string') {
    return body;
  }
  const payload = JSON.parse(body);
  // A batch of operations is a JSON array: the API looks for `api_key` on the body
  // itself, so there's no place for it. The PDF service doesn't batch; leave such
  // bodies as they are rather than guess.
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return body;
  }
  return JSON.stringify({ ...payload, api_key: apiKey });
};

async function customFetch(url: URL | RequestInfo, options: any = {}) {
  options.agent = getCustomAgent();

  // Add headers to help the API identify origin of requests
  options.headers = options.headers || {};
  options.headers['oc-env'] = process.env.OC_ENV || process.env.NODE_ENV || 'development';
  if (process.env.OC_SECRET) {
    options.headers['oc-secret'] = process.env.OC_SECRET;
  }
  options.headers['oc-application'] = 'pdf';
  options.headers['user-agent'] = 'opencollective-pdf/1.0 node-fetch/1.0';

  // Identify the PDF service to the API with the internal API key, in the body rather
  // than in the URL (see addApiKeyToBody). Every API call goes through this function:
  // HttpLink in createClient uses it as its fetch.
  options.body = addApiKeyToBody(options.body);

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
