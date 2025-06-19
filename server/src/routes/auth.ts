import express from 'express';
import { register, login, verifyToken, logout } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { registerSchema, loginSchema } from '../utils/validators';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/verify', authenticateToken, verifyToken);
router.post('/logout', logout);

export default router;