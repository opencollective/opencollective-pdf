import { queryString } from '../../../server/lib/utils';

test('queryString', () => {
  const result = queryString.stringify({ hello: 'world' });
  expect(result).toBe('hello=world');
});
