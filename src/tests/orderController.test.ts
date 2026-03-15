// orderController.test.ts
// Unit tests — calls controller functions directly with mocked req/res/next
// Prisma is mocked so no real database is needed

import express from 'express';
import * as controller from '../controllers/orderController';
import { prisma } from '../db';

// jest.mock hoists automatically in CommonJS — no dynamic imports needed
jest.mock('../db', () => ({
    prisma: {
        item:                { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
        order:               { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
        orderLine:           { deleteMany: jest.fn() },
        buyerCustomerParty:  { count: jest.fn(), create: jest.fn() },
        sellerCustomerParty: { count: jest.fn(), create: jest.fn() },
        $transaction:        jest.fn(),
    }
}));

// reset all mocks before each test
beforeEach(() => jest.clearAllMocks());

// ─── helpers ──────────────────────────────────────────────────────────────────

const makeRes = () => {
    const res = {} as any;
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    res.send   = jest.fn().mockReturnValue(res);
    res.type   = jest.fn().mockReturnValue(res);
    return res as express.Response;
};

const makeNext = () => jest.fn() as unknown as express.NextFunction;

// ─── sample data ──────────────────────────────────────────────────────────────

const sampleItem = {
    id: 'item-1', name: 'Laptop', description: 'A laptop', price: 999.99, sellerId: 'seller-1'
};

const sampleOrder = {
    id: 'order-1', orderDate: new Date().toISOString(), status: 'DRAFT', buyerId: 'buyer-1',
    lines: [{ id: 'line-1', orderId: 'order-1', itemId: 'item-1', quantity: 1, unitPrice: 999.99 }]
};

const sampleParty = {
    id: 'buyer-1',
    address: { streetNo: '1', streetName: 'Main St', postCode: '2000', suburbName: 'Sydney', stateName: 'NSW' },
    contact: { phoneNo: '0400000000', telefax: '0200000000', email: 'buyer@test.com' },
    person:  { firstName: 'Jason', surname: 'Smith', jobTitle: 'Manager' }
};

const validPartyBody = {
    streetNo: '1', streetName: 'Main St', postCode: '2000', suburbName: 'Sydney', stateName: 'NSW',
    phoneNo: '0400000000', telefax: '0200000000', email: 'buyer@test.com',
    firstName: 'Jason', surname: 'Smith', jobTitle: 'Manager'
};

// ─── listAllItems ─────────────────────────────────────────────────────────────

describe('listAllItems', () => {
    it('returns 200 with all items', async () => {
        (prisma.item.findMany as jest.Mock).mockResolvedValue([sampleItem]);

        const req = {} as express.Request;
        const res = makeRes();

        await controller.listAllItems(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([sampleItem]);
    });

    it('returns 200 with empty array when no items exist', async () => {
        (prisma.item.findMany as jest.Mock).mockResolvedValue([]);

        const req = {} as express.Request;
        const res = makeRes();

        await controller.listAllItems(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });
});

// ─── createItem ───────────────────────────────────────────────────────────────

describe('createItem', () => {
    it('returns 201 when item is created successfully', async () => {
        (prisma.sellerCustomerParty.count as jest.Mock).mockResolvedValue(1);
        (prisma.item.create as jest.Mock).mockResolvedValue(sampleItem);

        const req = { body: { name: 'Laptop', description: 'A laptop', price: 999.99, sellerId: 'seller-1' } } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createItem(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with validation error when fields are missing', async () => {
        const req = { body: { name: 'Laptop' } } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createItem(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
        expect(res.status).not.toHaveBeenCalled();
    });

    it('calls next with not found when seller does not exist', async () => {
        (prisma.sellerCustomerParty.count as jest.Mock).mockResolvedValue(0);

        const req = { body: { name: 'Laptop', description: 'A laptop', price: 9.99, sellerId: 'bad-id' } } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createItem(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });
});

// ─── createBuyerParty ─────────────────────────────────────────────────────────

describe('createBuyerParty', () => {
    it('returns 201 when buyer is created successfully', async () => {
        (prisma.buyerCustomerParty.create as jest.Mock).mockResolvedValue(sampleParty);

        const req = { body: validPartyBody } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createBuyerParty(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with validation error when fields are missing', async () => {
        const req = { body: { firstName: 'Jason' } } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createBuyerParty(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });
});

// ─── createSellerParty ────────────────────────────────────────────────────────

describe('createSellerParty', () => {
    it('returns 201 when seller is created successfully', async () => {
        (prisma.sellerCustomerParty.create as jest.Mock).mockResolvedValue({ ...sampleParty, id: 'seller-1' });

        const req = { body: validPartyBody } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createSellerParty(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with validation error when body is empty', async () => {
        const req = { body: {} } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createSellerParty(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });
});

// ─── listOrders ───────────────────────────────────────────────────────────────

describe('listOrders', () => {
    it('returns 200 with all orders', async () => {
        (prisma.order.findMany as jest.Mock).mockResolvedValue([sampleOrder]);

        const req = { query: {} } as express.Request;
        const res = makeRes();

        await controller.listOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([sampleOrder]);
    });

    it('filters by status when provided', async () => {
        (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

        const req = { query: { status: 'DRAFT' } } as unknown as express.Request;
        const res = makeRes();

        await controller.listOrders(req, res);

        expect(prisma.order.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ status: 'DRAFT' }) })
        );
    });
});

// ─── createOrder ──────────────────────────────────────────────────────────────

describe('createOrder', () => {
    it('returns 201 when order is created successfully', async () => {
        (prisma.item.findUnique as jest.Mock).mockResolvedValue(sampleItem);
        (prisma.buyerCustomerParty.count as jest.Mock).mockResolvedValue(1);
        (prisma.order.create as jest.Mock).mockResolvedValue(sampleOrder);

        const req = { body: { buyerId: 'buyer-1', itemId: 'item-1' } } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createOrder(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with validation error when buyerId is missing', async () => {
        const req = { body: { itemId: 'item-1' } } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });

    it('calls next with validation error when itemId is missing', async () => {
        const req = { body: { buyerId: 'buyer-1' } } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });

    it('calls next with not found when buyer does not exist', async () => {
        (prisma.item.findUnique as jest.Mock).mockResolvedValue(sampleItem);
        (prisma.buyerCustomerParty.count as jest.Mock).mockResolvedValue(0);

        const req = { body: { buyerId: 'bad-id', itemId: 'item-1' } } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });

    it('calls next with not found when item does not exist', async () => {
        (prisma.item.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.buyerCustomerParty.count as jest.Mock).mockResolvedValue(1);

        const req = { body: { buyerId: 'buyer-1', itemId: 'bad-id' } } as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });
});

// ─── getOrderById ─────────────────────────────────────────────────────────────

describe('getOrderById', () => {
    it('returns 200 with the order', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(sampleOrder);

        const req = { params: { orderId: 'order-1' } } as unknown as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.getOrderById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(sampleOrder);
    });

    it('calls next with not found when order does not exist', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

        const req = { params: { orderId: 'nonexistent' } } as unknown as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.getOrderById(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });
});

// ─── updateOrder ──────────────────────────────────────────────────────────────

describe('updateOrder', () => {
    it('returns 200 with updated order', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(sampleOrder);
        (prisma.order.update as jest.Mock).mockResolvedValue({ ...sampleOrder, status: 'SUBMITTED' });

        const req = { params: { orderId: 'order-1' }, body: { status: 'SUBMITTED' } } as unknown as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.updateOrder(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with validation error when status is missing', async () => {
        const req = { params: { orderId: 'order-1' }, body: {} } as unknown as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.updateOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'VALIDATION_ERROR' }));
    });

    it('calls next with not found when order does not exist', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

        const req = { params: { orderId: 'nonexistent' }, body: { status: 'SUBMITTED' } } as unknown as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.updateOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });
});

// ─── deleteOrder ──────────────────────────────────────────────────────────────

describe('deleteOrder', () => {
    it('returns 204 on successful delete', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(sampleOrder);
        (prisma.$transaction as jest.Mock).mockResolvedValue([]);

        const req = { params: { orderId: 'order-1' } } as unknown as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.deleteOrder(req, res, next);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next with not found when order does not exist', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

        const req = { params: { orderId: 'nonexistent' } } as unknown as express.Request;
        const res = makeRes();
        const next = makeNext();

        await controller.deleteOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'NOT_FOUND' }));
    });
});

// ─── generateUbl ─────────────────────────────────────────────────────────────

describe('generateUbl', () => {
    it('returns 200 with XML containing the order ID', () => {
        const req = { params: { orderId: 'order-1' } } as unknown as express.Request;
        const res = makeRes();

        controller.generateUbl(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<ID>order-1</ID>'));
    });
});