// orderController.test.ts
// Unit tests for orderController functions.
// Controller functions are called directly with mocked req/res/next objects.
// Prisma is mocked via jest.unstable_mockModule before any imports.

import { jest } from '@jest/globals';
import express from 'express';

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

const mockDb = {
    item: {
        findMany:   jest.fn<() => Promise<any>>(),
        findUnique: jest.fn<() => Promise<any>>(),
        create:     jest.fn<() => Promise<any>>(),
    },
    order: {
        findMany:   jest.fn<() => Promise<any>>(),
        findUnique: jest.fn<() => Promise<any>>(),
        create:     jest.fn<() => Promise<any>>(),
        update:     jest.fn<() => Promise<any>>(),
        delete:     jest.fn<() => Promise<any>>(),
    },
    orderLine: {
        deleteMany: jest.fn<() => Promise<any>>(),
    },
    buyerCustomerParty: {
        count:  jest.fn<() => Promise<any>>(),
        create: jest.fn<() => Promise<any>>(),
    },
    sellerCustomerParty: {
        count:  jest.fn<() => Promise<any>>(),
        create: jest.fn<() => Promise<any>>(),
    },
    $transaction: jest.fn<() => Promise<any>>(),
};

jest.unstable_mockModule('../db.ts', () => ({ prisma: mockDb }));

const orderController = await import('../controllers/orderController.ts');

beforeEach(() => jest.clearAllMocks());

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockRes = () => {
    const res = {
        status: jest.fn<() => any>(),
        json:   jest.fn<() => any>(),
        send:   jest.fn<() => any>(),
        type:   jest.fn<() => any>(),
    } as unknown as express.Response;
    // chain: res.status(201).json(...) — status returns the same res object
    (res.status as jest.Mock<() => any>).mockReturnValue(res);
    (res.type   as jest.Mock<() => any>).mockReturnValue(res);
    return res;
};

const mockNext = () => jest.fn<() => any>() as unknown as express.NextFunction;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockItem = {
    id: 'item-1', name: 'Laptop', description: 'A laptop', price: 999.99, sellerId: 'seller-1',
};

const mockOrder = {
    id: 'order-1',
    orderDate: new Date().toISOString(),
    status: 'DRAFT',
    buyerId: 'buyer-1',
    lines: [{ id: 'line-1', orderId: 'order-1', itemId: 'item-1', quantity: 1, unitPrice: 999.99 }],
};

const mockParty = {
    id: 'buyer-1',
    address: { streetNo: '1', streetName: 'Main St', postCode: '2000', suburbName: 'Sydney', stateName: 'NSW' },
    contact: { phoneNo: '0400000000', telefax: '0200000000', email: 'buyer@test.com' },
    person:  { firstName: 'Jason', surname: 'Smith', jobTitle: 'Manager' },
};

const validPartyBody = {
    streetNo: '1', streetName: 'Main St', postCode: '2000', suburbName: 'Sydney', stateName: 'NSW',
    phoneNo: '0400000000', telefax: '0200000000', email: 'buyer@test.com',
    firstName: 'Jason', surname: 'Smith', jobTitle: 'Manager',
};

// ─── listAllItems ─────────────────────────────────────────────────────────────

describe('listAllItems', () => {
    it('returns 200 with all items', async () => {
        mockDb.item.findMany.mockResolvedValue([mockItem]);
        const req = {} as express.Request;
        const res = mockRes();

        await orderController.listAllItems(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([mockItem]);
    });

    it('returns 200 with empty array when no items', async () => {
        mockDb.item.findMany.mockResolvedValue([]);
        const req = {} as express.Request;
        const res = mockRes();

        await orderController.listAllItems(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });
});

// ─── createItem ───────────────────────────────────────────────────────────────

describe('createItem', () => {
    it('returns 201 with created item', async () => {
        mockDb.sellerCustomerParty.count.mockResolvedValue(1);
        mockDb.item.create.mockResolvedValue(mockItem);
        const req = { body: { name: 'Laptop', description: 'A laptop', price: 999.99, sellerId: 'seller-1' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createItem(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockItem);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with VALIDATION_ERROR when name is missing', async () => {
        const req = { body: { description: 'test', price: 9.99, sellerId: 'seller-1' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createItem(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
        expect(res.status).not.toHaveBeenCalled();
    });

    it('calls next with VALIDATION_ERROR when price is missing', async () => {
        const req = { body: { name: 'Laptop', description: 'test', sellerId: 'seller-1' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createItem(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });

    it('calls next with NOT_FOUND when seller does not exist', async () => {
        mockDb.sellerCustomerParty.count.mockResolvedValue(0);
        const req = { body: { name: 'Laptop', description: 'test', price: 9.99, sellerId: 'bad-id' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createItem(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });
});

// ─── createBuyerParty ────────────────────────────────────────────────────────

describe('createBuyerParty', () => {
    it('returns 201 with created buyer', async () => {
        mockDb.buyerCustomerParty.create.mockResolvedValue(mockParty);
        const req = { body: validPartyBody } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createBuyerParty(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockParty);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with VALIDATION_ERROR when firstName is missing', async () => {
        const { firstName: _, ...body } = validPartyBody;
        const req = { body } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createBuyerParty(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });

    it('calls next with VALIDATION_ERROR when email is missing', async () => {
        const { email: _, ...body } = validPartyBody;
        const req = { body } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createBuyerParty(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });
});

// ─── createSellerParty ───────────────────────────────────────────────────────

describe('createSellerParty', () => {
    it('returns 201 with created seller', async () => {
        mockDb.sellerCustomerParty.create.mockResolvedValue({ ...mockParty, id: 'seller-1' });
        const req = { body: validPartyBody } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createSellerParty(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with VALIDATION_ERROR when body is empty', async () => {
        const req = { body: {} } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createSellerParty(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });
});

// ─── listOrders ───────────────────────────────────────────────────────────────

describe('listOrders', () => {
    it('returns 200 with all orders', async () => {
        mockDb.order.findMany.mockResolvedValue([mockOrder]);
        const req = { query: {} } as express.Request;
        const res = mockRes();

        await orderController.listOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([mockOrder]);
    });

    it('passes status filter to Prisma', async () => {
        mockDb.order.findMany.mockResolvedValue([]);
        const req = { query: { status: 'DRAFT' } } as unknown as express.Request;
        const res = mockRes();

        await orderController.listOrders(req, res);

        expect(mockDb.order.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ status: 'DRAFT' }) })
        );
    });

    it('passes buyerId filter to Prisma', async () => {
        mockDb.order.findMany.mockResolvedValue([]);
        const req = { query: { buyerId: 'buyer-1' } } as unknown as express.Request;
        const res = mockRes();

        await orderController.listOrders(req, res);

        expect(mockDb.order.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ buyerId: 'buyer-1' }) })
        );
    });
});

// ─── createOrder ──────────────────────────────────────────────────────────────

describe('createOrder', () => {
    it('returns 201 with new order', async () => {
        mockDb.item.findUnique.mockResolvedValue(mockItem);
        mockDb.buyerCustomerParty.count.mockResolvedValue(1);
        mockDb.order.create.mockResolvedValue(mockOrder);
        const req = { body: { buyerId: 'buyer-1', itemId: 'item-1' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createOrder(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockOrder);
        expect(next).not.toHaveBeenCalled();
    });

    it('defaults quantity to 1', async () => {
        mockDb.item.findUnique.mockResolvedValue(mockItem);
        mockDb.buyerCustomerParty.count.mockResolvedValue(1);
        mockDb.order.create.mockResolvedValue(mockOrder);
        const req = { body: { buyerId: 'buyer-1', itemId: 'item-1' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createOrder(req, res, next);

        expect(mockDb.order.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    lines: expect.objectContaining({
                        create: expect.objectContaining({ quantity: 1 }),
                    }),
                }),
            })
        );
    });

    it('uses item price as unitPrice', async () => {
        mockDb.item.findUnique.mockResolvedValue(mockItem);
        mockDb.buyerCustomerParty.count.mockResolvedValue(1);
        mockDb.order.create.mockResolvedValue(mockOrder);
        const req = { body: { buyerId: 'buyer-1', itemId: 'item-1' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createOrder(req, res, next);

        expect(mockDb.order.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    lines: expect.objectContaining({
                        create: expect.objectContaining({ unitPrice: mockItem.price }),
                    }),
                }),
            })
        );
    });

    it('calls next with VALIDATION_ERROR when buyerId is missing', async () => {
        const req = { body: { itemId: 'item-1' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
        expect(res.status).not.toHaveBeenCalled();
    });

    it('calls next with VALIDATION_ERROR when itemId is missing', async () => {
        const req = { body: { buyerId: 'buyer-1' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });

    it('calls next with NOT_FOUND when buyer does not exist', async () => {
        mockDb.item.findUnique.mockResolvedValue(mockItem);
        mockDb.buyerCustomerParty.count.mockResolvedValue(0);
        const req = { body: { buyerId: 'bad-id', itemId: 'item-1' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });

    it('calls next with NOT_FOUND when item does not exist', async () => {
        mockDb.item.findUnique.mockResolvedValue(null);
        mockDb.buyerCustomerParty.count.mockResolvedValue(1);
        const req = { body: { buyerId: 'buyer-1', itemId: 'bad-id' } } as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });
});

// ─── getOrderById ─────────────────────────────────────────────────────────────

describe('getOrderById', () => {
    it('returns 200 with the order', async () => {
        mockDb.order.findUnique.mockResolvedValue(mockOrder);
        const req = { params: { orderId: 'order-1' } } as unknown as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.getOrderById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockOrder);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with NOT_FOUND when order does not exist', async () => {
        mockDb.order.findUnique.mockResolvedValue(null);
        const req = { params: { orderId: 'nonexistent' } } as unknown as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.getOrderById(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
        expect(res.status).not.toHaveBeenCalled();
    });
});

// ─── updateOrder ──────────────────────────────────────────────────────────────

describe('updateOrder', () => {
    it('returns 200 with updated order', async () => {
        mockDb.order.findUnique.mockResolvedValue(mockOrder);
        mockDb.order.update.mockResolvedValue({ ...mockOrder, status: 'SUBMITTED' });
        const req = { params: { orderId: 'order-1' }, body: { status: 'SUBMITTED' } } as unknown as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.updateOrder(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'SUBMITTED' }));
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with VALIDATION_ERROR when status is missing', async () => {
        const req = { params: { orderId: 'order-1' }, body: {} } as unknown as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.updateOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });

    it('calls next with NOT_FOUND when order does not exist', async () => {
        mockDb.order.findUnique.mockResolvedValue(null);
        const req = { params: { orderId: 'nonexistent' }, body: { status: 'SUBMITTED' } } as unknown as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.updateOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });

    it('passes correct status to prisma.order.update', async () => {
        mockDb.order.findUnique.mockResolvedValue(mockOrder);
        mockDb.order.update.mockResolvedValue({ ...mockOrder, status: 'CANCELLED' });
        const req = { params: { orderId: 'order-1' }, body: { status: 'CANCELLED' } } as unknown as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.updateOrder(req, res, next);

        expect(mockDb.order.update).toHaveBeenCalledWith(
            expect.objectContaining({ data: { status: 'CANCELLED' } })
        );
    });
});

// ─── deleteOrder ──────────────────────────────────────────────────────────────

describe('deleteOrder', () => {
    it('returns 204 on successful delete', async () => {
        mockDb.order.findUnique.mockResolvedValue(mockOrder);
        mockDb.$transaction.mockResolvedValue([{ count: 1 }, mockOrder]);
        const req = { params: { orderId: 'order-1' } } as unknown as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.deleteOrder(req, res, next);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('runs deletion inside a transaction', async () => {
        mockDb.order.findUnique.mockResolvedValue(mockOrder);
        mockDb.$transaction.mockResolvedValue([{ count: 1 }, mockOrder]);
        const req = { params: { orderId: 'order-1' } } as unknown as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.deleteOrder(req, res, next);

        expect(mockDb.$transaction).toHaveBeenCalled();
    });

    it('calls next with NOT_FOUND when order does not exist', async () => {
        mockDb.order.findUnique.mockResolvedValue(null);
        const req = { params: { orderId: 'nonexistent' } } as unknown as express.Request;
        const res = mockRes();
        const next = mockNext();

        await orderController.deleteOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
        expect(res.status).not.toHaveBeenCalled();
    });
});

// ─── generateUbl ─────────────────────────────────────────────────────────────

describe('generateUbl', () => {
    it('returns 200 with XML containing the order ID', () => {
        const req = { params: { orderId: 'order-1' } } as unknown as express.Request;
        const res = mockRes();

        orderController.generateUbl(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<ID>order-1</ID>'));
    });

    it('includes XML declaration in response', () => {
        const req = { params: { orderId: 'order-1' } } as unknown as express.Request;
        const res = mockRes();

        orderController.generateUbl(req, res);

        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<?xml version="1.0"'));
    });

    it('sets content-type to application/xml', () => {
        const req = { params: { orderId: 'order-1' } } as unknown as express.Request;
        const res = mockRes();

        orderController.generateUbl(req, res);

        expect(res.type).toHaveBeenCalledWith('application/xml');
    });
});