import request from 'supertest';
import app from '../index.js';

describe('Orders API', () => {
  let authToken: string;

  beforeAll(async () => {
    // 登录获取token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123'
      });

    authToken = response.body.token;
  });

  describe('GET /api/orders', () => {
    it('should return user orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fail without auth token', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});