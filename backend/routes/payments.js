import express from 'express';
import {
    getPayments,
    getPaymentById,
    processPayment,
    refundPayment,
    getPaymentStats,
} from '../controllers/paymentsController.js';

const router = express.Router();

router.get('/', getPayments);
router.get('/stats', getPaymentStats);
router.get('/:id', getPaymentById);
router.post('/', processPayment);
router.post('/:id/refund', refundPayment);

export default router;
