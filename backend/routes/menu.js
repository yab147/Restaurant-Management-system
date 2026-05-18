import express from 'express';
import {
    getMenu,
    addMenuItem,
    getMenuItemById,
    updateMenuItem,
    updateMenuAvailability,
    deleteMenuItem,
    getMenuCategories,
    addMenuCategory,
} from '../controllers/menuController.js';

const router = express.Router();

router.get('/', getMenu);
router.get('/categories', getMenuCategories);
router.post('/categories', addMenuCategory);
router.get('/:id', getMenuItemById);
router.post('/', addMenuItem);
router.patch('/:id/availability', updateMenuAvailability);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
