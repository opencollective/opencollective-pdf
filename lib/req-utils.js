import { get } from 'lodash';

export const getAccessTokenFromReq = ctx => {
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
