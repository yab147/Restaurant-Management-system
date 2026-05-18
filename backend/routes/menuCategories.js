import express from 'express';
import { addMenuCategory, getMenuCategories } from '../controllers/menuController.js';

const router = express.Router();

router.get('/', getMenuCategories);
router.post('/', addMenuCategory);

export default router;
