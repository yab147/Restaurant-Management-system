import express from 'express';
import {
    getReservations,
    getReservationById,
    createReservation,
    updateReservation,
    cancelReservation,
    confirmReservation,
} from '../controllers/reservationsController.js';

const router = express.Router();

router.get('/', getReservations);
router.get('/:id', getReservationById);
router.post('/', createReservation);
router.put('/:id', updateReservation);
router.patch('/:id/cancel', cancelReservation);
router.patch('/:id/confirm', confirmReservation);

export default router;
