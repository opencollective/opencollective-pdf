import { expect, test } from 'vitest';
import request from 'supertest';
import app from '../../server';

test('returns a 404 for unknown routes', async () => {
  const response = await request(app).get('/unknown-route');
  expect(response.status).toBe(404);
  expect(response.body.message).toBe('Route not found');
});
