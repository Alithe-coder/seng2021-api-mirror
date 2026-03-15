// orderController.ts — MVP version
// try/catch blocks are intentionally omitted. express-async-errors wraps every
// async handler so unhandled rejections automatically reach the global error
// handler in middleware/errorHandler.ts.

import express from 'express';
import type { AppError } from '../middleware/errorHandler.ts';
import { prisma } from '../db';
import {
    validateCreateOrder,
    validateCreateItem,
    validateCreateParty,
    validateUpdateOrder
} from '../utils/orderValidation';

// ─── Items ────────────────────────────────────────────────────────────────────

// GET /api/v1/orders/items
export const listAllItems = async (req: express.Request, res: express.Response) => {
    const allItems = await prisma.item.findMany();
    res.status(200).json(allItems);
};

// POST /api/v1/orders/item/new
export const createItem = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validateCreateItem(req.body);
    if (errors.length > 0) {
        const err: AppError = new Error('Invalid item data provided');
        err.type = 'VALIDATION_ERROR';
        err.details = errors;
        return next(err);
    }

    const sellerExists = await prisma.sellerCustomerParty.count({ where: { id: req.body.sellerId } });
    if (sellerExists === 0) {
        const err: AppError = new Error('Seller not found');
        err.type = 'NOT_FOUND';
        return next(err);
    }

    const newItem = await prisma.item.create({
        data: {
            description: req.body.description,
            name: req.body.name,
            price: req.body.price,
            sellerId: req.body.sellerId,
        },
    });

    res.status(201).json(newItem);
};

// ─── Parties ──────────────────────────────────────────────────────────────────

// POST /api/v1/orders/buyer/new
export const createBuyerParty = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validateCreateParty(req.body);
    if (errors.length > 0) {
        const err: AppError = new Error('Invalid buyer data provided');
        err.type = 'VALIDATION_ERROR';
        err.details = errors;
        return next(err);
    }

    const newBuyer = await prisma.buyerCustomerParty.create({
        data: {
            address: { create: {
                streetNo: req.body.streetNo,
                streetName: req.body.streetName,
                postCode: req.body.postCode,
                suburbName: req.body.suburbName,
                stateName: req.body.stateName,
            }},
            contact: { create: {
                phoneNo: req.body.phoneNo,
                telefax: req.body.telefax,
                email: req.body.email,
            }},
            person: { create: {
                firstName: req.body.firstName,
                surname: req.body.surname,
                jobTitle: req.body.jobTitle,
            }},
        },
        include: { address: true, contact: true, person: true },
    });

    res.status(201).json(newBuyer);
};

// POST /api/v1/orders/seller/new
export const createSellerParty = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validateCreateParty(req.body);
    if (errors.length > 0) {
        const err: AppError = new Error('Invalid seller data provided');
        err.type = 'VALIDATION_ERROR';
        err.details = errors;
        return next(err);
    }

    const newSeller = await prisma.sellerCustomerParty.create({
        data: {
            address: { create: {
                streetNo: req.body.streetNo,
                streetName: req.body.streetName,
                postCode: req.body.postCode,
                suburbName: req.body.suburbName,
                stateName: req.body.stateName,
            }},
            contact: { create: {
                phoneNo: req.body.phoneNo,
                telefax: req.body.telefax,
                email: req.body.email,
            }},
            person: { create: {
                firstName: req.body.firstName,
                surname: req.body.surname,
                jobTitle: req.body.jobTitle,
            }},
        },
        include: { address: true, contact: true, person: true },
    });

    res.status(201).json(newSeller);
};

// ─── Orders ───────────────────────────────────────────────────────────────────

// GET /api/v1/orders
export const listOrders = async (req: express.Request, res: express.Response) => {
    const { status, buyerId } = req.query;

    const orders = await prisma.order.findMany({
        where: {
            ...(status  && { status: String(status) }),
            ...(buyerId && { buyerId: String(buyerId) }),
        },
        include: {
            buyer: { include: { person: true, contact: true } },
            lines: { include: { item: true } },
        },
        orderBy: { orderDate: 'desc' },
    });

    res.status(200).json(orders);
};

// POST /api/v1/orders
export const createOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validateCreateOrder(req.body);
    if (errors.length > 0) {
        const err: AppError = new Error('Invalid order data provided');
        err.type = 'VALIDATION_ERROR';
        err.details = errors;
        return next(err);
    }

    const { buyerId, itemId, quantity = 1 } = req.body;

    const [item, buyerExists] = await Promise.all([
        prisma.item.findUnique({ where: { id: itemId } }),
        prisma.buyerCustomerParty.count({ where: { id: buyerId } }),
    ]);

    if (!item || buyerExists === 0) {
        const err: AppError = new Error('Buyer or Item not found');
        err.type = 'NOT_FOUND';
        return next(err);
    }

    const newOrder = await prisma.order.create({
        data: {
            orderDate: new Date(),
            buyerId,
            lines: { create: { itemId, quantity, unitPrice: item.price } },
        },
        include: { lines: true },
    });

    res.status(201).json(newOrder);
};

// GET /api/v1/orders/:orderId
export const getOrderById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const orderId = req.params.orderId as string;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            buyer: { include: { address: true, contact: true, person: true } },
            lines: { include: { item: true } },
        },
    });

    if (!order) {
        const err: AppError = new Error(`No order exists with the provided ID: ${orderId}`);
        err.type = 'NOT_FOUND';
        return next(err);
    }

    res.status(200).json(order);
};

// PUT /api/v1/orders/:orderId
export const updateOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const orderId = req.params.orderId as string;

    const errors = validateUpdateOrder(req.body);
    if (errors.length > 0) {
        const err: AppError = new Error('Invalid update data provided');
        err.type = 'VALIDATION_ERROR';
        err.details = errors;
        return next(err);
    }

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existingOrder) {
        const err: AppError = new Error(`No order exists with the ID: ${orderId}`);
        err.type = 'NOT_FOUND';
        return next(err);
    }

    const updated = await prisma.order.update({
        where: { id: orderId },
        data: { status: req.body.status },
        include: { lines: true },
    });

    res.status(200).json(updated);
};

// DELETE /api/v1/orders/:orderId
export const deleteOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const orderId = req.params.orderId as string;

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existingOrder) {
        const err: AppError = new Error(`No order exists with the ID: ${orderId}`);
        err.type = 'NOT_FOUND';
        return next(err);
    }

    await prisma.$transaction([
        prisma.orderLine.deleteMany({ where: { orderId } }),
        prisma.order.delete({ where: { id: orderId } }),
    ]);

    res.status(204).send();
};

// GET /api/v1/orders/:orderId/ubl
export const generateUbl = (req: express.Request, res: express.Response) => {
    const orderId = req.params.orderId as string;

    res.status(200).type('application/xml').send(
        `<?xml version="1.0" encoding="UTF-8"?>\n<Order><ID>${orderId}</ID><Status>Skeleton</Status></Order>`
    );
};