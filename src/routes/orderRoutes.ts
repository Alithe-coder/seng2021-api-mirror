// Router: maps HTTP requests to controller functions.
// IMPORTANT: Static routes (/items, /seller/new, etc.) must be declared
// BEFORE parameterised routes (/:orderId), otherwise Express will treat
// "items" as an orderId and never reach the right handler.

import { Router } from 'express';
import * as orderController from '../controllers/orderController';

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
 *         description: Array of items returned successfully
 *       500:
 *         description: Internal server error
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
 *               name:        { type: string, example: Laptop }
 *               description: { type: string, example: A high-end laptop }
 *               price:       { type: number, example: 999.99 }
 *               sellerId:    { type: string, example: seller-uuid }
 *     responses:
 *       201:
 *         description: Item created successfully
 *       422:
 *         description: Validation error - required fields missing or invalid
 *       404:
 *         description: Seller not found
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
 *         description: Buyer created successfully
 *       422:
 *         description: Validation error - required fields missing or invalid
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
 *         description: Seller created successfully
 *       422:
 *         description: Validation error - required fields missing or invalid
 */
router.post('/seller/new', orderController.createSellerParty);

// ─── Order collection routes ──────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: List all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, SUBMITTED, CANCELLED]
 *         description: Filter orders by status
 *       - in: query
 *         name: buyerId
 *         schema: { type: string }
 *         description: Filter orders by buyer ID
 *     responses:
 *       200:
 *         description: Array of orders returned successfully
 *       500:
 *         description: Internal server error
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
 *               buyerId:  { type: string, example: buyer-uuid }
 *               itemId:   { type: string, example: item-uuid }
 *               quantity: { type: integer, example: 1, default: 1 }
 *     responses:
 *       201:
 *         description: Order created successfully
 *       422:
 *         description: Validation error - buyerId or itemId missing
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
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order retrieved successfully
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
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DRAFT, SUBMITTED, CANCELLED]
 *                 example: SUBMITTED
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       422:
 *         description: Validation error - status missing or invalid value
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
 *         description: The ID of the order to delete
 *     responses:
 *       204:
 *         description: Order deleted successfully
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
 *         description: The ID of the order to export
 *     responses:
 *       200:
 *         description: UBL XML document
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 *               example: <?xml version="1.0" encoding="UTF-8"?><Order><ID>order-uuid</ID></Order>
 */
router.get('/:orderId/ubl', orderController.generateUbl);

export default router;