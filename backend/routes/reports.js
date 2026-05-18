import express from 'express';
import {
    getSalesSummary,
    getTopItems,
    getDashboardReport,
    exportReportsCsv,
} from '../controllers/reportsController.js';

const router = express.Router();

router.get('/sales', getSalesSummary);
router.get('/top-items', getTopItems);
router.get('/dashboard', getDashboardReport);
router.get('/export', exportReportsCsv);

export default router;
