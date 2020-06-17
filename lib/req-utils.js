import { get } from 'lodash';

export const getAccessTokenFromReq = (ctx) => {
  const { req } = ctx;
  const authorizationHeader = get(req, 'headers.authorization') || get(req, 'headers.Authorization');
  if (!authorizationHeader) {
    return;
  }

  const parts = authorizationHeader.split(' ');
  const scheme = parts[0];
  const accessToken = parts[1];
  if (!/^Bearer$/i.test(scheme) || !accessToken) {
    throw new Error('Invalid authorization header. Format should be: Authorization: Bearer [token]');
  }
  return accessToken;
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
