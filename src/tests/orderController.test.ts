import * as orderController from '../controllers/orderController.ts';
import { jest } from '@jest/globals';
import { Request, Response } from 'express'

describe('Order controller unit tests', () => {
  const mockResponse = () => {
    const res: Response = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  test('createOrder returns 201 with created order', async () => {
    const req: Request = {
      body: {
        buyerName: 'Jason',
        item: 'Laptop',
        quantity: 2,
      },
    };
    const res = mockResponse();

    await orderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      buyerName: 'Jason',
      item: 'Laptop',
      quantity: 2,
    });
  });

  test('listOrders returns 200 with filters', () => {
    const req: Request = {
      query: { buyerName: 'Jason' },
    };
    const res = mockResponse();

    orderController.listOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'List orders',
      filters: { buyerName: 'Jason' },
    });
  });

  test('getOrderById returns 200', () => {
    const req: Request = {
      params: { orderId: '123' },
    };
    const res = mockResponse();

    orderController.getOrderById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order to be retrieved 123',
    });
  });

  test('updateOrder returns 200', () => {
    const req: Request = {
      params: { orderId: '123' },
    };
    const res = mockResponse();

    orderController.updateOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order to be retrieved 123',
    });
  });

  test('deleteOrder returns 204', () => {
    const req: Request = {};
    const res = mockResponse();

    orderController.deleteOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test('generateUbl returns XML', () => {
    const req: Request = {
      params: { orderId: '123' },
    };
    const res = mockResponse();

    orderController.generateUbl(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      '<Order><ID>123</ID><Status>Skeleton</Status></Order>'
    );
  });
});