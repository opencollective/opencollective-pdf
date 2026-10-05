import { describe, expect, test, vi } from 'vitest';
import hyperwatch from '@hyperwatch/hyperwatch';

import { redactLog } from '../../server/lib/hyperwatch.js';

const createLog = (url: string, headers: Record<string, string>) =>
  hyperwatch.util.createLog({ ip: '127.0.0.1', method: 'GET', originalUrl: url, headers }, { statusCode: 200 });

describe('hyperwatch', () => {
  describe('redactLog', () => {
    test('redacts sensitive headers and preserves the rest', () => {
      const log = redactLog(
        createLog('/receipts/transactions/1/receipt.pdf', {
          authorization: 'Bearer secret',
          'api-key': 'secret',
          'personal-token': 'secret',
          'x-api-key': 'secret',
          cookie: 'session=secret',
          'user-agent': 'Mozilla/5.0',
        }),
      );
      expect(log.getIn(['request', 'headers']).toJS()).toEqual({
        authorization: '[Filtered]',
        'api-key': '[Filtered]',
        'personal-token': '[Filtered]',
        'x-api-key': '[Filtered]',
        cookie: '[Filtered]',
        'user-agent': 'Mozilla/5.0',
      });
    });

    test('redacts sensitive query params and preserves the rest', () => {
      const log = redactLog(
        createLog('/expenses/1/invoice.pdf?personalToken=secret&apiKey=secret&app_key=secret&lang=fr', {}),
      );
      expect(log.getIn(['request', 'url'])).toBe(
        '/expenses/1/invoice.pdf?personalToken=[Filtered]&apiKey=[Filtered]&app_key=[Filtered]&lang=fr',
      );
      expect(redactLog(createLog('/debug-sentry?key=secret', {})).getIn(['request', 'url'])).toBe(
        '/debug-sentry?key=[Filtered]',
      );
      expect(redactLog(createLog('/', {})).getIn(['request', 'url'])).toBe('/');
    });
  });

  describe('load', () => {
    test('without HYPERWATCH_SECRET, does nothing: no logging, no API', async () => {
      vi.resetModules();
      vi.stubEnv('HYPERWATCH_ENABLED', 'true');
      vi.stubEnv('HYPERWATCH_SECRET', '');
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { load } = await import('../../server/lib/hyperwatch.js');
      const app = { use: vi.fn() };
      const server = { on: vi.fn() };
      load(app as never, server as never);
      expect(app.use).not.toHaveBeenCalled();
      expect(server.on).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalledWith('Hyperwatch: HYPERWATCH_SECRET is not set, Hyperwatch is disabled');
      warn.mockRestore();
      vi.unstubAllEnvs();
    });
  });
});
