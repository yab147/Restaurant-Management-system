import express from 'express';
import { login, signup, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', authenticate, getMe);

export default router;
