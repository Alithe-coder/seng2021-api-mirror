// Router: maps HTTP requests to controller functions.
// IMPORTANT: Static routes (/items, /seller/new, etc.) must be declared
// BEFORE parameterised routes (/:orderId), otherwise Express will treat
// "items" as an orderId and never reach the right handler.

import { Router } from 'express';
import * as orderController from '../controllers/orderController.ts';

const router = Router();

// ─── Static routes (must come before /:orderId) ──────────────────────────────

/**
 * @openapi
 * /api/v1/orders/items:
 *   get:
 *     summary: List all available items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Array of items
 */
router.get('/items', orderController.listAllItems);

/**
 * @openapi
 * /api/v1/orders/item/new:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, sellerId]
 *             properties:
 *               name:        { type: string }
 *               description: { type: string }
 *               price:       { type: number }
 *               sellerId:    { type: string }
 *     responses:
 *       201:
 *         description: Item created
 */
router.post('/item/new', orderController.createItem);

/**
 * @openapi
 * /api/v1/orders/buyer/new:
 *   post:
 *     summary: Create a new buyer party
 *     tags: [Parties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartyInput'
 *     responses:
 *       201:
 *         description: Buyer created
 */
router.post('/buyer/new', orderController.createBuyerParty);

/**
 * @openapi
 * /api/v1/orders/seller/new:
 *   post:
 *     summary: Create a new seller party
 *     tags: [Parties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartyInput'
 *     responses:
 *       201:
 *         description: Seller created
 */
router.post('/seller/new', orderController.createSellerParty);

// ─── Order collection routes ──────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: List all orders (supports filter query params)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *         description: Filter by order status
 *       - in: query
 *         name: buyerId
 *         schema: { type: string }
 *         description: Filter by buyer ID
 *     responses:
 *       200:
 *         description: Array of orders
 */
router.get('/', orderController.listOrders);

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [buyerId, itemId]
 *             properties:
 *               buyerId:  { type: string }
 *               itemId:   { type: string }
 *               quantity: { type: integer, default: 1 }
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Buyer or item not found
 */
router.post('/', orderController.createOrder);

// ─── Order resource routes (parameterised — must come last) ──────────────────

/**
 * @openapi
 * /api/v1/orders/{orderId}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
router.get('/:orderId', orderController.getOrderById);

/**
 * @openapi
 * /api/v1/orders/{orderId}:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Order updated
 *       404:
 *         description: Order not found
 */
router.put('/:orderId', orderController.updateOrder);

/**
 * @openapi
 * /api/v1/orders/{orderId}:
 *   delete:
 *     summary: Delete an order and its lines
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Order not found
 */
router.delete('/:orderId', orderController.deleteOrder);

/**
 * @openapi
 * /api/v1/orders/{orderId}/ubl:
 *   get:
 *     summary: Export order as UBL XML
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: UBL XML document
 */
router.get('/:orderId/ubl', orderController.generateUbl);

export default router;