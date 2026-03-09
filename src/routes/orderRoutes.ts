
import { Router } from 'express';
import * as orderController from '../orderController';

const router = Router();

router.post('/', orderController.createOrder);

export default router;