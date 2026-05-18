import express from 'express';
import {
    getOrders,
    getOrderById,
    getOrderQueue,
    getOrderStats,
    createOrder,
    updateOrder,
    updateOrderStatus,
    assignOrder,
    deleteOrder,
    addOrderItem,
    removeOrderItem,
} from '../controllers/ordersController.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/queue', getOrderQueue);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.post('/:id/items', addOrderItem);
router.delete('/:id/items/:itemId', removeOrderItem);
router.put('/:id', updateOrder);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/assign', assignOrder);
router.delete('/:id', deleteOrder);

export default router;
