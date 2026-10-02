import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import crypto from 'crypto';
import type { Request } from 'express';

const getSampleRate = (value: string | undefined): number => {
  const parsed = parseFloat(value ?? '');
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.min(1, Math.max(0, parsed));
};

export const getTracesSampleRate = (): number => getSampleRate(process.env.SENTRY_TRACES_SAMPLE_RATE);

export const getProfileSessionSampleRate = (): number => getSampleRate(process.env.SENTRY_PROFILES_SAMPLE_RATE);

export const checkIfSentryConfigured = (): boolean => Boolean(process.env.SENTRY_DSN);

/**
 * Validates the shared secret protecting the `/debug-sentry` endpoint. Returns false when
 * no key is configured, so the endpoint stays disabled by default. Uses a constant-time
 * comparison to avoid leaking the key through timing.
 */
export const isValidDebugSentryKey = (provided: unknown): boolean => {
  const expected = process.env.DEBUG_SENTRY_KEY;
  if (!expected || typeof provided !== 'string' || !provided) {
    return false;
  }
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};

type ErrorWithStatus = {
  status?: unknown;
  statusCode?: unknown;
  status_code?: unknown;
};

const getHttpStatus = (error: ErrorWithStatus): number | undefined => {
  for (const value of [error.status, error.statusCode, error.status_code]) {
    const status = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
    if (typeof status === 'number' && Number.isInteger(status)) {
      return status;
    }
  }
  return undefined;
};

/**
 * Gate for Sentry's automatic Express error capture. Expected client errors (3xx/4xx, including
 * `PDFServiceError` with a status below 500) are skipped; 5xx and status-less errors are reported.
 */
export const shouldHandleError = (error: Error): boolean => {
  const status = getHttpStatus(error as ErrorWithStatus);
  return status === undefined || status >= 500;
};

// Auth material flows through this service: `Authorization` / `Api-Key` / `Personal-Token`
// headers and `apiKey` / `personalToken` / `app_key` query params (see `authentication.ts`).
const SENSITIVE_KEYS = new Set([
  'cookie',
  'authorization',
  'api-key',
  'apikey',
  'personal-token',
  'personaltoken',
  'app_key',
  'app-key',
  'oc-secret',
  'x-api-key',
]);

const redactQueryString = (query: unknown): unknown => {
  if (typeof query === 'string') {
    return query
      .split('&')
      .map(pair => {
        const separatorIndex = pair.indexOf('=');
        const key = separatorIndex === -1 ? pair : pair.slice(0, separatorIndex);
        let normalizedKey = key;
        try {
          normalizedKey = decodeURIComponent(key);
        } catch {
          // Keep the raw key if it cannot be decoded
        }
        return SENSITIVE_KEYS.has(normalizedKey.toLowerCase()) ? `${key}=[Filtered]` : pair;
      })
      .join('&');
  }
  if (query && typeof query === 'object' && !Array.isArray(query)) {
    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(query as Record<string, unknown>)) {
      redacted[key] = SENSITIVE_KEYS.has(key.toLowerCase()) ? '[Filtered]' : value;
    }
    return redacted;
  }
  return query;
};

export const redactEventRequest = <T>(event: T): T => {
  const request = (event as { request?: unknown })?.request as
    | { headers?: unknown; cookies?: unknown; query_string?: unknown }
    | undefined;
  if (!request || typeof request !== 'object') {
    return event;
  }
  try {
    const redactedRequest = { ...request };
    if (redactedRequest.headers && typeof redactedRequest.headers === 'object') {
      const headers: Record<string, unknown> = { ...(redactedRequest.headers as Record<string, unknown>) };
      for (const name of Object.keys(headers)) {
        if (SENSITIVE_KEYS.has(name.toLowerCase())) {
          headers[name] = '[Filtered]';
        }
      }
      redactedRequest.headers = headers;
    }
    if (redactedRequest.cookies !== undefined) {
      redactedRequest.cookies = '[Filtered]';
    }
    if (redactedRequest.query_string !== undefined) {
      redactedRequest.query_string = redactQueryString(redactedRequest.query_string);
    }
    (event as { request?: unknown }).request = redactedRequest;
  } catch {
    // Never break error reporting because of redaction
  }
  return event;
};

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.OC_ENV || process.env.NODE_ENV || 'development',
  release: process.env.HEROKU_SLUG_COMMIT || `opencollective-pdf@${process.env.npm_package_version || 'dev'}`,
  integrations: [
    Sentry.expressIntegration({ shouldHandleError }),
    // Only load the native profiler when profiling is actually sampled
    ...(getProfileSessionSampleRate() > 0 ? [nodeProfilingIntegration()] : []),
  ],
  // Sampling is off by default; enable via SENTRY_TRACES_SAMPLE_RATE / SENTRY_PROFILES_SAMPLE_RATE
  tracesSampleRate: getTracesSampleRate(),
  profileSessionSampleRate: getProfileSessionSampleRate(),
  profileLifecycle: 'trace',
  attachStacktrace: true,
  enabled: process.env.NODE_ENV !== 'test' && checkIfSentryConfigured(),
  beforeSend(event) {
    return redactEventRequest(event);
  },
});

type ReportOptions = {
  severity?: Sentry.SeverityLevel;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  req?: Request;
};

const stringifyExtra = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
};

/**
 * Manually report an error to Sentry. Request errors flowing through Express are already
 * captured automatically by `expressIntegration`; use this for errors outside that path or
 * for adding extra context to a manually captured error.
 */
export const reportErrorToSentry = (
  err: unknown,
  { severity = 'error', tags, extra, req }: ReportOptions = {},
): void => {
  if (!err) {
    return;
  }
  if (checkIfSentryConfigured() && process.env.NODE_ENV !== 'test') {
    Sentry.withScope(scope => {
      scope.setLevel(severity);
      if (tags) {
        for (const [key, value] of Object.entries(tags)) {
          scope.setTag(key, value);
        }
      }
      if (extra) {
        for (const [key, value] of Object.entries(extra)) {
          scope.setExtra(key, stringifyExtra(value));
        }
      }
      if (req) {
        scope.setSDKProcessingMetadata({ request: req });
      }
      Sentry.captureException(err);
    });
  } else if (process.env.NODE_ENV !== 'test') {
    console.error(err instanceof Error ? err.stack || err.message : err);
  }
};

export const reportMessageToSentry = (
  message: string,
  { severity = 'error', tags, extra }: ReportOptions = {},
): void => {
  if (checkIfSentryConfigured() && process.env.NODE_ENV !== 'test') {
    Sentry.withScope(scope => {
      scope.setLevel(severity);
      if (tags) {
        for (const [key, value] of Object.entries(tags)) {
          scope.setTag(key, value);
        }
      }
      if (extra) {
        for (const [key, value] of Object.entries(extra)) {
          scope.setExtra(key, stringifyExtra(value));
        }
      }
      Sentry.captureMessage(message);
    });
  } else if (process.env.NODE_ENV !== 'test') {
    console.error(`[Sentry fallback] ${message}`);
  }
};

// Global fallback for errors that never reach Express (e.g. rejected promises, timers)
process
  .on('unhandledRejection', reason => {
    reportErrorToSentry(reason instanceof Error ? reason : new Error(`Unhandled Rejection: ${String(reason)}`), {
      severity: 'fatal',
      tags: { handler: 'fallback' },
    });
  })
  .on('uncaughtException', err => {
    reportErrorToSentry(err, { severity: 'fatal', tags: { handler: 'fallback' } });
  });

export { Sentry };
