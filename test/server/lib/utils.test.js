import { queryString } from '../../../src/server/lib/utils';

test('queryString', () => {
  const result = queryString.stringify({ hello: 'world' });
  expect(result).toBe('hello=world');
});
