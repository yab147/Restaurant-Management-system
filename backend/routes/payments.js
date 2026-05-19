import express from 'express';
import {
    getPayments,
    getPaymentById,
    processPayment,
    refundPayment,
    getPaymentStats,
} from '../controllers/paymentsController.js';
import { requireRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();
const refundRoles = requireRoles('admin');

router.get('/', getPayments);
router.get('/stats', getPaymentStats);
router.get('/:id', getPaymentById);
router.post('/', processPayment);
router.post('/:id/refund', refundRoles, refundPayment);

export default router;
