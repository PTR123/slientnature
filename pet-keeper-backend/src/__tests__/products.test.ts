import request from 'supertest';
import app from '../index.js';

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return products list', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=5')
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('should support category filter', async () => {
      const response = await request(app)
        .get('/api/products?categoryId=test-category')
        .expect(200);

      expect(response.body).toHaveProperty('products');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product details', async () => {
      const productId = '8bea892f-ad05-47a0-a2ee-497d3708f60b';

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('id', productId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});