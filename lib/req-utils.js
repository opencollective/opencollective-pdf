import { get } from 'lodash';

export const getAccessTokenFromReq = (
  ctx,
  errorMsg = `Not authorized to access ${ctx.req.url}. Please provide an authorization header or an app_key.`,
) => {
  const { req } = ctx;
  const authorizationHeader = get(req, 'headers.authorization') || get(req, 'headers.Authorization');
  if (!authorizationHeader) {
    if (!get(req, 'query.app_key') && !get(ctx, 'query.app_key')) {
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
