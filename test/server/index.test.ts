import request from 'supertest';
import app from '../../server';

it('returns a 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Not Found');
});