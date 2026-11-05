import http from 'http';
import { AddressInfo } from 'net';

import { gql } from '@apollo/client/index.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { addApiKeyToBody, createClient, getGraphqlUrl } from '../../server/lib/apollo-client.js';

// API_KEY is the internal key identifying the PDF service to the API. It must reach
// the API in the JSON body (`api_key`), never in the URL, where it would end up in
// access logs (see addApiKeyToBody in server/lib/apollo-client.ts).

describe('apollo-client', () => {
  describe('getGraphqlUrl', () => {
    it('does not put the API key in the URL', () => {
      process.env.API_KEY = 'test-api-key';
      expect(getGraphqlUrl('v2')).not.toContain('test-api-key');
      expect(getGraphqlUrl('v2')).toMatch(/\/graphql\/v2$/);
    });
  });

  describe('addApiKeyToBody', () => {
    it('adds the API key to the JSON body', () => {
      const body = JSON.stringify({ query: '{ __typename }', variables: { id: 1 } });
      expect(JSON.parse(addApiKeyToBody(body, 'test-api-key') as string)).toEqual({
        query: '{ __typename }',
        variables: { id: 1 },
        api_key: 'test-api-key',
      });
    });

    it('leaves the body as is without an API key', () => {
      const body = JSON.stringify({ query: '{ __typename }' });
      expect(addApiKeyToBody(body, '')).toBe(body);
    });

    it('leaves a missing body or a batch (JSON array) as is', () => {
      expect(addApiKeyToBody(undefined, 'test-api-key')).toBeUndefined();
      const batch = JSON.stringify([{ query: '{ __typename }' }]);
      expect(addApiKeyToBody(batch, 'test-api-key')).toBe(batch);
    });
  });

  // End to end through Apollo Client: a local server stands in for the API and
  // records what the PDF service actually sends
  describe('createClient', () => {
    let server: http.Server;
    let received: { url?: string; headers?: http.IncomingHttpHeaders; body?: Record<string, unknown> } = {};
    const env = { API_URL: process.env.API_URL, API_KEY: process.env.API_KEY };

    beforeAll(async () => {
      server = http.createServer((req, res) => {
        let data = '';
        req.on('data', chunk => (data += chunk));
        req.on('end', () => {
          received = { url: req.url, headers: req.headers, body: JSON.parse(data) };
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ data: { me: null } }));
        });
      });
      await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
      process.env.API_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      process.env.API_KEY = 'test-api-key';
    });

    afterAll(async () => {
      process.env.API_URL = env.API_URL;
      process.env.API_KEY = env.API_KEY;
      await new Promise(resolve => server.close(resolve));
    });

    it('sends the API key in the body, not in the URL nor as a header', async () => {
      const client = createClient({ Authorization: 'Bearer user-token' });
      // A real field: Apollo answers a bare `{ __typename }` from its cache, without a request
      await client.query({ query: gql('query Test { me { id } }') });

      expect(received.url).toBe('/graphql/v2');
      expect(received.body?.api_key).toBe('test-api-key');
      expect(received.body?.query).toContain('me');
      expect(received.headers?.['api-key']).toBeUndefined();
      // The user's credentials and the service headers are unchanged
      expect(received.headers?.authorization).toBe('Bearer user-token');
      expect(received.headers?.['oc-application']).toBe('pdf');
    });
  });
});
