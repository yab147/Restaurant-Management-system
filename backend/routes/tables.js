import express from 'express';
import {
    getTables,
    getTableById,
    createTable,
    updateTable,
    updateTableStatus,
    deleteTable,
} from '../controllers/tablesController.js';
import { requireRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getTables);
router.get('/:id', getTableById);
router.post('/', requireRoles('admin', 'manager'), createTable);
router.patch('/:id/status', requireRoles('admin', 'waiter'), updateTableStatus);
router.put('/:id', requireRoles('admin', 'manager'), updateTable);
router.delete('/:id', requireRoles('admin', 'manager'), deleteTable);

export default router;
