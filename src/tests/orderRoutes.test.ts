// orderRoutes.test.ts
// Integration tests — sends HTTP requests via supertest
// and checks the correct status codes come back from each route

import request from 'supertest';
import app from '../app';
import { prisma } from '../db';

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

beforeEach(() => jest.clearAllMocks());

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
    person:  { firstName: 'Bruce', surname: 'Wayne', jobTitle: 'BATMAN' }
};

const validPartyBody = {
    streetNo: '1', streetName: 'Main St', postCode: '2000', suburbName: 'Sydney', stateName: 'NSW',
    phoneNo: '0400000000', telefax: '0200000000', email: 'buyer@test.com',
    firstName: 'Clark', surname: 'Kent', jobTitle: 'SUPERMAN'
};

// ─── GET /api/v1/orders ───────────────────────────────────────────────────────

describe('GET /api/v1/orders', () => {
    it('returns 200 with list of orders', async () => {
        (prisma.order.findMany as jest.Mock).mockResolvedValue([sampleOrder]);

        const res = await request(app).get('/api/v1/orders');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe('order-1');
    });

    it('returns 200 with empty array when no orders exist', async () => {
        (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

        const res = await request(app).get('/api/v1/orders');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('filters by status query param', async () => {
        (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

        await request(app).get('/api/v1/orders?status=DRAFT');

        expect(prisma.order.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ status: 'DRAFT' }) })
        );
    });
});

// ─── POST /api/v1/orders ──────────────────────────────────────────────────────

describe('POST /api/v1/orders', () => {
    it('returns 201 with created order', async () => {
        (prisma.item.findUnique as jest.Mock).mockResolvedValue(sampleItem);
        (prisma.buyerCustomerParty.count as jest.Mock).mockResolvedValue(1);
        (prisma.order.create as jest.Mock).mockResolvedValue(sampleOrder);

        const res = await request(app).post('/api/v1/orders').send({ buyerId: 'buyer-1', itemId: 'item-1' });

        expect(res.status).toBe(201);
        expect(res.body.id).toBe('order-1');
    });

    it('returns 422 when buyerId is missing', async () => {
        const res = await request(app).post('/api/v1/orders').send({ itemId: 'item-1' });

        expect(res.status).toBe(422);
    });

    it('returns 422 when itemId is missing', async () => {
        const res = await request(app).post('/api/v1/orders').send({ buyerId: 'buyer-1' });

        expect(res.status).toBe(422);
    });

    it('returns 404 when buyer does not exist', async () => {
        (prisma.item.findUnique as jest.Mock).mockResolvedValue(sampleItem);
        (prisma.buyerCustomerParty.count as jest.Mock).mockResolvedValue(0);

        const res = await request(app).post('/api/v1/orders').send({ buyerId: 'bad-id', itemId: 'item-1' });

        expect(res.status).toBe(404);
    });

    it('returns 404 when item does not exist', async () => {
        (prisma.item.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.buyerCustomerParty.count as jest.Mock).mockResolvedValue(1);

        const res = await request(app).post('/api/v1/orders').send({ buyerId: 'buyer-1', itemId: 'bad-id' });

        expect(res.status).toBe(404);
    });
});

// ─── GET /api/v1/orders/:orderId ──────────────────────────────────────────────

describe('GET /api/v1/orders/:orderId', () => {
    it('returns 200 with the order', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(sampleOrder);

        const res = await request(app).get('/api/v1/orders/order-1');

        expect(res.status).toBe(200);
        expect(res.body.id).toBe('order-1');
    });

    it('returns 404 when order does not exist', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get('/api/v1/orders/nonexistent');

        expect(res.status).toBe(404);
    });
});

// ─── PUT /api/v1/orders/:orderId ──────────────────────────────────────────────

describe('PUT /api/v1/orders/:orderId', () => {
    it('returns 200 with updated order', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(sampleOrder);
        (prisma.order.update as jest.Mock).mockResolvedValue({ ...sampleOrder, status: 'SUBMITTED' });

        const res = await request(app).put('/api/v1/orders/order-1').send({ status: 'SUBMITTED' });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUBMITTED');
    });

    it('returns 422 when status is missing', async () => {
        const res = await request(app).put('/api/v1/orders/order-1').send({});

        expect(res.status).toBe(422);
    });

    it('returns 404 when order does not exist', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

        const res = await request(app).put('/api/v1/orders/nonexistent').send({ status: 'SUBMITTED' });

        expect(res.status).toBe(404);
    });
});

// ─── DELETE /api/v1/orders/:orderId ──────────────────────────────────────────

describe('DELETE /api/v1/orders/:orderId', () => {
    it('returns 204 on successful delete', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(sampleOrder);
        (prisma.$transaction as jest.Mock).mockResolvedValue([]);

        const res = await request(app).delete('/api/v1/orders/order-1');

        expect(res.status).toBe(204);
    });

    it('returns 404 when order does not exist', async () => {
        (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

        const res = await request(app).delete('/api/v1/orders/nonexistent');

        expect(res.status).toBe(404);
    });
});

// ─── GET /api/v1/orders/:orderId/ubl ─────────────────────────────────────────

describe('GET /api/v1/orders/:orderId/ubl', () => {
    it('returns 200 with XML containing the order ID', async () => {
        const res = await request(app).get('/api/v1/orders/order-1/ubl');

        expect(res.status).toBe(200);
        expect(res.text).toContain('<ID>order-1</ID>');
    });

    it('sets content-type to application/xml', async () => {
        const res = await request(app).get('/api/v1/orders/order-1/ubl');

        expect(res.headers['content-type']).toMatch(/application\/xml/);
    });
});

// ─── GET /api/v1/orders/items ─────────────────────────────────────────────────

describe('GET /api/v1/orders/items', () => {
    it('returns 200 with list of items', async () => {
        (prisma.item.findMany as jest.Mock).mockResolvedValue([sampleItem]);

        const res = await request(app).get('/api/v1/orders/items');

        expect(res.status).toBe(200);
        expect(res.body[0].name).toBe('Laptop');
    });
});

// ─── POST /api/v1/orders/item/new ─────────────────────────────────────────────

describe('POST /api/v1/orders/item/new', () => {
    it('returns 201 with created item', async () => {
        (prisma.sellerCustomerParty.count as jest.Mock).mockResolvedValue(1);
        (prisma.item.create as jest.Mock).mockResolvedValue(sampleItem);

        const res = await request(app).post('/api/v1/orders/item/new')
            .send({ name: 'Laptop', description: 'A laptop', price: 999.99, sellerId: 'seller-1' });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Laptop');
    });

    it('returns 422 when required fields are missing', async () => {
        const res = await request(app).post('/api/v1/orders/item/new').send({ name: 'Laptop' });

        expect(res.status).toBe(422);
    });

    it('returns 404 when seller does not exist', async () => {
        (prisma.sellerCustomerParty.count as jest.Mock).mockResolvedValue(0);

        const res = await request(app).post('/api/v1/orders/item/new')
            .send({ name: 'Laptop', description: 'A laptop', price: 999.99, sellerId: 'bad-id' });

        expect(res.status).toBe(404);
    });
});

// ─── POST /api/v1/orders/buyer/new ───────────────────────────────────────────

describe('POST /api/v1/orders/buyer/new', () => {
    it('returns 201 with created buyer', async () => {
        (prisma.buyerCustomerParty.create as jest.Mock).mockResolvedValue(sampleParty);

        const res = await request(app).post('/api/v1/orders/buyer/new').send(validPartyBody);

        expect(res.status).toBe(201);
        expect(res.body.id).toBe('buyer-1');
    });

    it('returns 422 when required fields are missing', async () => {
        const res = await request(app).post('/api/v1/orders/buyer/new').send({ firstName: 'Jason' });

        expect(res.status).toBe(422);
    });
});

// ─── POST /api/v1/orders/seller/new ──────────────────────────────────────────

describe('POST /api/v1/orders/seller/new', () => {
    it('returns 201 with created seller', async () => {
        (prisma.sellerCustomerParty.create as jest.Mock).mockResolvedValue({ ...sampleParty, id: 'seller-1' });

        const res = await request(app).post('/api/v1/orders/seller/new').send(validPartyBody);

        expect(res.status).toBe(201);
        expect(res.body.id).toBe('seller-1');
    });

    it('returns 422 when required fields are missing', async () => {
        const res = await request(app).post('/api/v1/orders/seller/new').send({});

        expect(res.status).toBe(422);
    });
});