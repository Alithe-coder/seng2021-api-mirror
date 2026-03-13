
// this file is a Router - essentially directs our commands from terminal to the controller.
// e.g., user sends POST request, request is directed to Router, router identifies its a post request
// for order creation, Router then redirects request to controller through orderController.createOrder
// which then executes the controller code - which is always backend functions + status and JSON message

import { Router } from 'express';
import * as orderController from '../controllers/orderController.ts';

const router = Router();

// e.g. evertime we do curl -X POST http://localhost:3000/api/v1/orders, orderController.createOrder

// POST /api/v1/orders - Create
//router.post('/', orderController.createOrder);

// GET /api/v1/orders - List orders
router.get('/', orderController.listOrders);

// GET /api/v1/orders/:orderId - Retreive
router.get('/:orderId', orderController.getOrderById);

// PUT /api/v1/orders/:orderId - update
router.put('/:orderId', orderController.updateOrder);

// DELETE /api/v1/orders/:orderId - Delete
router.delete('/:orderId', orderController.deleteOrder);

// GET /api/v1/orders/:orderId/ubl - Export XML
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