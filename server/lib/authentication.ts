import { isEmpty, get } from 'lodash-es';
import express from 'express';
import { UnauthorizedError } from './errors.js';

export type AuthorizationHeaders = {
  'oc-env'?: string;
  'oc-application'?: string;
  'user-agent'?: string;
  'Api-Key'?: string;
  'Personal-Token'?: string;
  Authorization?: string;
};

/**
 * To forward API Key or Authorization headers from the request to the API calls.
 * Returns `null` if no headers are found.
 */
const getAuthorizationHeadersFromCtx = (req: express.Request): AuthorizationHeaders | null => {
  const { headers, query } = req;
  const result: AuthorizationHeaders = {};
  const apiKey = get(headers, 'api-key') || get(query, 'apiKey');
  const personalToken = get(headers, 'personal-token') || get(query, 'personalToken') || get(query, 'app_key');
  const authorization = get(headers, 'authorization');
  if (authorization) {
    const [scheme, accessToken] = authorization.split(' ');
    if (scheme !== 'Bearer' || !accessToken) {
      throw new Error('Invalid authorization header. Format should be: Authorization: Bearer [token]');
    }

    result['Authorization'] = authorization;
  }

  if (apiKey) {
    result['Api-Key'] = apiKey as string;
  }

  if (personalToken) {
    result['Personal-Token'] = personalToken as string;
  }

  return isEmpty(result) ? null : result;
};

/**
 * Some syntax sugar around the `getAuthorizationHeadersFromReq` function, that throws for non-authenticated requests
 * but allows `OPTIONS` requests to pass through
 */
export const authenticateRequest = (req: express.Request): AuthorizationHeaders => {
  const authorizationHeaders = getAuthorizationHeadersFromCtx(req);
  if (!authorizationHeaders) {
    throw new UnauthorizedError('Please provide an access token or an APP key');
  }

  return authorizationHeaders;
};
