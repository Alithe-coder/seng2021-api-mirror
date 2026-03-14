
// this file is a Router - essentially directs our commands from terminal to the controller.
// e.g., user sends POST request, request is directed to Router, router identifies its a post request
// for order creation, Router then redirects request to controller through orderController.createOrder
// which then executes the controller code - which is always backend functions + status and JSON message

import { Router } from 'express';
import * as orderController from '../controllers/orderController.ts';

const router = Router();

// e.g. evertime we do curl -X POST http://localhost:3000/api/v1/orders, orderController.createOrder

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyerName:
 *                 type: string
 *               item:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', orderController.createOrder);

// GET /api/v1/orders - List orders
/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: buyerName
 *         schema:
 *           type: string
 *         description: Filter orders by buyer name
 *     responses:
 *       200:
 *         description: A list of orders
 */
router.get('/', orderController.listOrders);

// GET /api/v1/orders/:orderId - Retreive
/**
 * @openapi
 * /api/v1/orders/{orderId}:
 *   get:
 *     summary: Retrieve a specific order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 */
router.get('/:orderId', orderController.getOrderById);

// PUT /api/v1/orders/:orderId - update
/**
 * @openapi
 * /api/v1/orders/{orderId}:
 *   put:
 *     summary: Update an existing order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyerName:
 *                 type: string
 *               item:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 */
router.put('/:orderId', orderController.updateOrder);

// DELETE /api/v1/orders/:orderId - Delete
/**
 * @openapi
 * /api/v1/orders/{orderId}:
 *   delete:
 *     summary: Delete an order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to delete
 *     responses:
 *       204:
 *         description: Order deleted successfully
 */
router.delete('/:orderId', orderController.deleteOrder);

// GET /api/v1/orders/:orderId/ubl - Export XML
/**
 * @openapi
 * /api/v1/orders/{orderId}/ubl:
 *   post:
 *     summary: Generate UBL XML for an order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: UBL XML generated successfully
 */
router.post('/:orderId/ubl', orderController.generateUbl);
// POST api/v1/orders/seller/sellerId
router.post('/seller/new', orderController.createSellerParty);
// POST api/v1/orders/buyer/buyerId
router.post('/buyer/new', orderController.createBuyerParty);
// GET all items api/v1/items
router.get("/items", orderController.listAllItems);
// POST api/v1/item/itemId
router.post("/item/new", orderController.createItem)
// POST api/v1/order/orderId
router.post("/order/new", orderController.createOrder)
export default router;