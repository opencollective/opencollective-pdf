import { get, isEmpty } from 'lodash';

/**
 * To forward API Key or Authorization headers from the request to the API calls.
 * Returns `null` if no headers are found.
 */
export const getAuthorizationHeadersFromReq = (req) => {
  const { headers, query } = req;
  const result = {};
  const apiKey = get(headers, 'api-key') || get(query, 'apiKey');
  const personalToken = get(headers, 'personal-token') || get(query, 'personalToken') || get(query, 'app_key');
  const authorization = get(headers, 'authorization');
  if (authorization) {
    const [scheme, accessToken] = authorization.split(' ');
    if (scheme !== 'Bearer' || !accessToken) {
      throw new Error('Invalid authorization header. Format should be: Authorization: Bearer [token]');
    }

    result['Authorization'] = authorization;
  } else if (apiKey) {
    result['Api-Key'] = apiKey;
  } else if (personalToken) {
    result['Personal-Token'] = personalToken;
  }

  return isEmpty(headers) ? null : headers;
};

/**
 * Some syntax sugar around the `getAuthorizationHeadersFromReq` function, that throws for non-authenticated requests
 * but allows `OPTIONS` requests to pass through
 */
export const authenticateRequest = (ctx) => {
  const authorizationHeaders = getAuthorizationHeadersFromReq(ctx);
  if (!authorizationHeaders) {
    // Frontend sends an OPTIONS request to check CORS, we should just return OK when that happens
    if (ctx.req.method === 'OPTIONS') {
      return null;
    } else {
      throw new Error('Please provide an access token or an APP key');
    }
  }

  return authorizationHeaders;
};

export const setCORSHeaders = (ctx) => {
  // Set Access-Control-Allow-Headers
  ctx.res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type');

  // Set Access-Control-Allow-Origin
  if (process.env.WEBSITE_URL === 'https://opencollective.com') {
    ctx.res.setHeader('Access-Control-Allow-Origin', process.env.WEBSITE_URL);
  } else {
    // Always allow requests on non-prod environments
    ctx.res.setHeader('Access-Control-Allow-Origin', '*');
  }
};
