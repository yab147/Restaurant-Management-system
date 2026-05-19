/**
 * Public read-only endpoints (no auth) — used by marketing site / landing page.
 */
import express from 'express';
import { getMenu, getMenuCategories } from '../controllers/menuController.js';

const router = express.Router();

router.get('/menu', getMenu);
router.get('/menu-categories', getMenuCategories);

export default router;
