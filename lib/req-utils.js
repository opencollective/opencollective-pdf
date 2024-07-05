import { get, isEmpty } from 'lodash';
import { UnauthorizedError } from './errors';

/**
 * To forward API Key or Authorization headers from the request to the API calls.
 * Returns `null` if no headers are found.
 */
const getAuthorizationHeadersFromCtx = (ctx) => {
  const { req, query } = ctx;
  const { headers } = req;
  const result = {};
  const apiKey = get(headers, 'api-key') || get(query, 'apiKey');
  const personalToken = get(headers, 'personal-token') || get(query, 'personalToken') || get(query, 'app_key');
  const authorization = get(headers, 'authorization');
  if (authorization) {
    const [scheme, accessToken] = authorization.split(' ');
    if (scheme !== 'Bearer' || !accessToken) {
      throw new UnauthorizedError('Invalid authorization header. Format should be: Authorization: Bearer [token]');
    }

    result['Authorization'] = authorization;
  }

  if (apiKey) {
    result['Api-Key'] = apiKey;
  }

  if (personalToken) {
    result['Personal-Token'] = personalToken;
  }

  return isEmpty(result) ? null : result;
};

/**
 * Some syntax sugar around the `getAuthorizationHeadersFromReq` function, that throws for non-authenticated requests
 * but allows `OPTIONS` requests to pass through
 */
export const authenticateRequest = (ctx) => {
  const authorizationHeaders = getAuthorizationHeadersFromCtx(ctx);
  if (!authorizationHeaders) {
    // Frontend sends an OPTIONS request to check CORS, we should just return OK when that happens
    if (ctx.req.method === 'OPTIONS') {
      return null;
    } else {
      throw new UnauthorizedError('Please provide an access token or an APP key');
    }
  }

  return authorizationHeaders;
};

export const setCORSHeaders = (res) => {
  // Set Access-Control-Allow-Headers
  res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type,baggage,sentry-trace');

  // Set Access-Control-Allow-Origin
  if (process.env.WEBSITE_URL === 'https://opencollective.com') {
    res.setHeader('Access-Control-Allow-Origin', process.env.WEBSITE_URL);
  } else {
    // Always allow requests on non-prod environments
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
};
