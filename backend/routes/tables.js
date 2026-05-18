import express from 'express';
import {
    getTables,
    getTableById,
    createTable,
    updateTable,
    updateTableStatus,
    deleteTable,
} from '../controllers/tablesController.js';

const router = express.Router();

router.get('/', getTables);
router.get('/:id', getTableById);
router.post('/', createTable);
router.patch('/:id/status', updateTableStatus);
router.put('/:id', updateTable);
router.delete('/:id', deleteTable);

export default router;
