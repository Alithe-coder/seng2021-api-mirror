
import { Router } from 'express';
import * as orderController from '../controllers/orderController.ts';

const router = Router();

router.post('/', orderController.createOrder);

export default router;