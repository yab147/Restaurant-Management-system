import express from 'express';
import {
    getIngredients,
    getIngredientById,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    getLowStockIngredients,
    restockIngredient,
} from '../controllers/ingredientsController.js';

const router = express.Router();

router.get('/', getIngredients);
router.get('/low-stock', getLowStockIngredients);
router.get('/:id', getIngredientById);
router.post('/', createIngredient);
router.patch('/:id/restock', restockIngredient);
router.put('/:id', updateIngredient);
router.delete('/:id', deleteIngredient);

export default router;
