import type http from 'http';

import hyperwatch from '@hyperwatch/hyperwatch';
import type express from 'express';
import expressBasicAuth from 'express-basic-auth';

import { parseToBoolean } from './env.js';
import { SENSITIVE_KEYS, redactQueryString } from './sentry.js';

const {
  HYPERWATCH_ENABLED: enabled,
  HYPERWATCH_PATH: path,
  HYPERWATCH_USERNAME: username,
  HYPERWATCH_SECRET: secret,
} = process.env;

export const isHyperwatchEnabled = (): boolean => parseToBoolean(enabled) === true;

/**
 * Keeps credentials (auth headers, cookies, token query params) out of the logs sent to Hyperwatch.
 */
export const redactLog = log => {
  for (const name of log.getIn(['request', 'headers']).keys()) {
    if (SENSITIVE_KEYS.has(name.toLowerCase())) {
      log = log.setIn(['request', 'headers', name], '[Filtered]');
    }
  }

  const url: string = log.getIn(['request', 'url']);
  const separatorIndex = url.indexOf('?');
  if (separatorIndex !== -1) {
    const queryString = redactQueryString(url.slice(separatorIndex + 1));
    log = log.setIn(['request', 'url'], `${url.slice(0, separatorIndex)}?${queryString}`);
  }

  return log;
};

/**
 * @param server The HTTP server of the app, needed to serve the Hyperwatch WebSocket streams
 */
export function load(app: express.Application, server: http.Server) {
  // Never expose Hyperwatch (logs with client IPs and URLs) without authentication
  if (!secret) {
    console.warn('Hyperwatch: HYPERWATCH_SECRET is not set, Hyperwatch is disabled');
    return;
  }

  const { input, modules, pipeline } = hyperwatch;

  // Init
  hyperwatch.init({
    modules: {
      // Expose the status page
      status: { active: true },
      // Expose logs (HTTP and Websocket)
      logs: { active: true },
    },
  });

  // Mount Hyperwatch API and WebSocket streams
  const hyperwatchBasicAuth = expressBasicAuth({
    users: { [username || 'opencollective']: secret },
    challenge: true,
  });
  hyperwatch.app.mount(app, {
    server,
    path: path || '/_hyperwatch',
    // The WebSocket upgrades go through the app like HTTP requests, so basic auth applies to both
    middleware: hyperwatchBasicAuth,
    // No fallback: Hyperwatch answers 404 to the upgrades it doesn't own, as we serve no other WebSocket
  });

  // Configure input

  const expressInput = input.express.create();

  app.use(expressInput.middleware());

  // The log is sent when the response finishes: redact it before that
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    req['hyperwatch'].rawLog = redactLog(req['hyperwatch'].rawLog);
    next();
  });

  pipeline.registerInput(expressInput);

  // Start

  modules.start();

  pipeline.start();
}

export default load;
