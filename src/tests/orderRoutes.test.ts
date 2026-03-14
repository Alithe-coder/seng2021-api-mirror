import request from 'supertest';
import app from '../app.ts';


describe('Order API system tests', () => {
  test('POST /api/v1/orders creates an order', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        buyerName: 'Jason',
        item: 'Laptop',
        quantity: 2,
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 1,
      buyerName: 'Jason',
      item: 'Laptop',
      quantity: 2,
    });
  });

  test('GET /api/v1/orders returns list orders message', async () => {
    const res = await request(app).get('/api/v1/orders');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'List orders');
    expect(res.body).toHaveProperty('filters');
  });

  test('GET /api/v1/orders/123 returns requested order message', async () => {
    const res = await request(app).get('/api/v1/orders/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Order to be retrieved 123',
    });
  });

  test('PUT /api/v1/orders/123 updates the order', async () => {
    const res = await request(app)
      .put('/api/v1/orders/123')
      .send({
        buyerName: 'Updated Buyer',
        item: 'Phone',
        quantity: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Order to be retrieved 123',
    });
  });

  test('DELETE /api/v1/orders/123 returns 204', async () => {
    const res = await request(app).delete('/api/v1/orders/123');

    expect(res.status).toBe(204);
  });

  test('POST /api/v1/orders/123/ubl returns XML', async () => {
    const res = await request(app).post('/api/v1/orders/123/ubl');

    expect(res.status).toBe(200);
    expect(res.text).toBe('<Order><ID>123</ID><Status>Skeleton</Status></Order>');
  });
});