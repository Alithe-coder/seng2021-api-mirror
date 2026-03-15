import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// POST /api/v1/auth/register - create a new user account
router.post('/register', authController.registerUser);

// POST /api/v1/auth/login - get a JWT token
router.post('/login', authController.loginUser);

export default router;