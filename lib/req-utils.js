import { get } from 'lodash';

export const getAccessTokenFromReq = (
  req,
  errorMsg = `Not authorized to access ${req.url}. Please provide an authorization header or an app_key.`,
) => {
  const authorizationHeader = get(req, 'headers.authorization') || get(req, 'headers.Authorization');
  if (!authorizationHeader) {
    if (!get(req, 'query.app_key')) {
      throw new Error(errorMsg);
    } else {
      return;
    }
  }

  const parts = authorizationHeader.split(' ');
  const scheme = parts[0];
  const accessToken = parts[1];
  if (!/^Bearer$/i.test(scheme) || !accessToken) {
    throw new Error('Invalid authorization header. Format should be: Authorization: Bearer [token]');
  }
  return accessToken;
};
