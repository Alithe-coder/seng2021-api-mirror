
// this file is a Router - essentially directs our commands from terminal to the controller.
// e.g., user sends POST request, request is directed to Router, router identifies its a post request
// for order creation, Router then redirects request to controller through orderController.createOrder
// which then executes the controller code - which is always backend functions + status and JSON message

import { Router } from 'express';
import * as orderController from '../controllers/orderController.ts';

const router = Router();

// evertime we do curl -X POST http://localhost:3000/api/v1/orders, orderController.createOrder
router.post('/', orderController.createOrder);

export default router;