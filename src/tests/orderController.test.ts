import * as orderController from '../controllers/orderController.ts';
import { jest } from '@jest/globals';
import express from 'express'

describe('Order controller unit tests', () => {
  const mockResponse = () => ({
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
  } as unknown as express.Response);

  test('createOrder returns 201 with created order', async () => {
    const req = {
      body: {
        buyerName: 'Jason',
        item: 'Laptop',
        quantity: 2,
      },
    } as unknown as express.Request;
    const res = mockResponse();

    const next = jest.fn();
    await orderController.createOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      buyerName: 'Jason',
      item: 'Laptop',
      quantity: 2,
    });
  });

  test('listOrders returns 200 with filters', () => {
    const req = {
      query: { buyerName: 'Jason' },
    } as unknown as express.Request;
    const res = mockResponse();

    orderController.listOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'List orders',
      filters: { buyerName: 'Jason' },
    });
  });

  test('getOrderById returns 200', () => {
    const req = {
      params: { orderId: '123' },
    } as unknown as express.Request;
    const res = mockResponse();

    const next = jest.fn();
    orderController.getOrderById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order to be retrieved 123',
    });
  });

  test('updateOrder returns 200', () => {
    const req = {
      params: { orderId: '123' },
    } as unknown as express.Request;
    const res = mockResponse();

    const next = jest.fn();
    orderController.updateOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order to be retrieved 123',
    });
  });

  test('deleteOrder returns 204', () => {
    const req= {} as unknown as express.Request;
    const res = mockResponse();

    const next = jest.fn();
    orderController.deleteOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test('generateUbl returns XML', () => {
    const req = {
      params: { orderId: '123' },
    } as unknown as express.Request;
    const res = mockResponse();

    orderController.generateUbl(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      '<Order><ID>123</ID><Status>Skeleton</Status></Order>'
    );
  });
});