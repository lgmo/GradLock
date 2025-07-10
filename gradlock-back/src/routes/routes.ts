import express from 'express';
import { RoomsController } from '../controllers/roomsController';

const router = express.Router();

router.get('/rooms', RoomsController.getAllRooms);
router.get('/rooms/:id', RoomsController.getRoomById);

export default router;