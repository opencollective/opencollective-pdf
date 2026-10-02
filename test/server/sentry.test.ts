import { describe, expect, test, vi } from 'vitest';

import { BadRequestError, InternalServerError, NotFoundError, UnauthorizedError } from '../../server/lib/errors.js';
import {
  checkIfSentryConfigured,
  getProfileSessionSampleRate,
  getTracesSampleRate,
  isValidDebugSentryKey,
  redactEventRequest,
  reportErrorToSentry,
  reportMessageToSentry,
  shouldHandleError,
} from '../../server/lib/sentry.js';

describe('sentry', () => {
  describe('checkIfSentryConfigured', () => {
    test('returns false without a DSN and true with one', () => {
      vi.stubEnv('SENTRY_DSN', '');
      expect(checkIfSentryConfigured()).toBe(false);
      vi.stubEnv('SENTRY_DSN', 'https://key@o1.ingest.sentry.io/1');
      expect(checkIfSentryConfigured()).toBe(true);
      vi.unstubAllEnvs();
      expect(checkIfSentryConfigured()).toBe(false);
    });
  });

  describe('sample rates', () => {
    test('are off by default', () => {
      vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', '');
      vi.stubEnv('SENTRY_PROFILES_SAMPLE_RATE', '');
      expect(getTracesSampleRate()).toBe(0);
      expect(getProfileSessionSampleRate()).toBe(0);
      vi.unstubAllEnvs();
    });

    test('parse configured values and clamp them to 0..1', () => {
      vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', '0.2');
      vi.stubEnv('SENTRY_PROFILES_SAMPLE_RATE', '2');
      expect(getTracesSampleRate()).toBe(0.2);
      expect(getProfileSessionSampleRate()).toBe(1);
      vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', 'not-a-number');
      expect(getTracesSampleRate()).toBe(0);
      vi.unstubAllEnvs();
    });
  });

  describe('shouldHandleError', () => {
    test('captures 5xx and status-less errors', () => {
      expect(shouldHandleError(new Error('boom'))).toBe(true);
      expect(shouldHandleError(new InternalServerError('boom'))).toBe(true);
      expect(shouldHandleError(Object.assign(new Error('boom'), { statusCode: 503 }))).toBe(true);
      expect(shouldHandleError(Object.assign(new Error('boom'), { status: '500' }))).toBe(true);
    });

    test('skips expected client errors', () => {
      expect(shouldHandleError(new BadRequestError('nope'))).toBe(false);
      expect(shouldHandleError(new UnauthorizedError('nope'))).toBe(false);
      expect(shouldHandleError(new NotFoundError('nope'))).toBe(false);
      expect(shouldHandleError(Object.assign(new Error('redirect'), { status: 302 }))).toBe(false);
    });
  });

  describe('redactEventRequest', () => {
    test('redacts sensitive headers case-insensitively and preserves the rest', () => {
      const event = {
        request: {
          headers: {
            authorization: 'Bearer secret',
            'X-Api-Key': 'secret',
            cookie: 'session=secret',
            'content-type': 'application/json',
          },
        },
      };
      const redacted = redactEventRequest(event).request.headers;
      expect(redacted).toMatchObject({
        authorization: '[Filtered]',
        'X-Api-Key': '[Filtered]',
        cookie: '[Filtered]',
        'content-type': 'application/json',
      });
    });

    test('redacts cookies and sensitive query params', () => {
      const event = {
        request: {
          cookies: 'session=secret',
          query_string: 'personalToken=secret&slug=my-collective',
        },
      };
      const redacted = redactEventRequest(event).request;
      expect(redacted.cookies).toBe('[Filtered]');
      expect(redacted.query_string).toBe('personalToken=[Filtered]&slug=my-collective');
    });

    test('redacts object query strings and leaves other events untouched', () => {
      const event = { request: { query_string: { apiKey: 'secret', slug: 'my-collective' } } };
      expect(redactEventRequest(event).request.query_string).toEqual({
        apiKey: '[Filtered]',
        slug: 'my-collective',
      });
      expect(redactEventRequest({}).request).toBeUndefined();
      expect(redactEventRequest(null)).toBeNull();
    });
  });

  describe('isValidDebugSentryKey', () => {
    test('is disabled without a configured key', () => {
      vi.stubEnv('DEBUG_SENTRY_KEY', '');
      expect(isValidDebugSentryKey('anything')).toBe(false);
      vi.unstubAllEnvs();
      expect(isValidDebugSentryKey('anything')).toBe(false);
    });

    test('accepts only the exact key', () => {
      vi.stubEnv('DEBUG_SENTRY_KEY', 'test-secret');
      expect(isValidDebugSentryKey('test-secret')).toBe(true);
      expect(isValidDebugSentryKey('wrong-secret')).toBe(false);
      expect(isValidDebugSentryKey('test-secre')).toBe(false);
      expect(isValidDebugSentryKey('')).toBe(false);
      expect(isValidDebugSentryKey(undefined)).toBe(false);
      expect(isValidDebugSentryKey(['test-secret'])).toBe(false);
      vi.unstubAllEnvs();
    });
  });

  describe('report helpers', () => {
    test('do not throw when Sentry is not configured', () => {
      vi.stubEnv('SENTRY_DSN', '');
      expect(() => reportErrorToSentry(new Error('boom'), { tags: { handler: 'test' } })).not.toThrow();
      expect(() => reportErrorToSentry(null)).not.toThrow();
      expect(() => reportMessageToSentry('hello')).not.toThrow();
      vi.unstubAllEnvs();
    });
  });
});
