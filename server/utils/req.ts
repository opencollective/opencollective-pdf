import { isEmpty, get } from "lodash-es";
import express from "express";

/**
 * To forward API Key or Authorization headers from the request to the API calls.
 * Returns `null` if no headers are found.
 */
const getAuthorizationHeadersFromCtx = (req: express.Request) => {
  const { headers, query } = req;
  const result = {};
  const apiKey = get(headers, "api-key") || get(query, "apiKey");
  const personalToken =
    get(headers, "personal-token") ||
    get(query, "personalToken") ||
    get(query, "app_key");
  const authorization = get(headers, "authorization");
  if (authorization) {
    const [scheme, accessToken] = authorization.split(" ");
    if (scheme !== "Bearer" || !accessToken) {
      throw new Error(
        "Invalid authorization header. Format should be: Authorization: Bearer [token]"
      );
    }

    result["Authorization"] = authorization;
  }

  if (apiKey) {
    result["Api-Key"] = apiKey;
  }

  if (personalToken) {
    result["Personal-Token"] = personalToken;
  }

  return isEmpty(result) ? null : result;
};

/**
 * Some syntax sugar around the `getAuthorizationHeadersFromReq` function, that throws for non-authenticated requests
 * but allows `OPTIONS` requests to pass through
 */
export const authenticateRequest = (req: express.Request) => {
  const authorizationHeaders = getAuthorizationHeadersFromCtx(req);
  if (!authorizationHeaders) {
    // Frontend sends an OPTIONS request to check CORS, we should just return OK when that happens
    if (req.method === "OPTIONS") {
      return null;
    } else {
      throw new Error("Please provide an access token or an APP key"); // TODO: Proper error code
    }
  }

  return authorizationHeaders;
};
