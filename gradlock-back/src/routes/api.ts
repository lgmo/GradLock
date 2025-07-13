import express from 'express';
import { RoomsController } from '../controllers/roomsController';

const apiRouter = express.Router();

// Rotas de salas
apiRouter.get('/rooms', RoomsController.getAllRooms);
apiRouter.get('/rooms/:id', RoomsController.getRoomById);
apiRouter.post('/rooms', RoomsController.createRoom);

export default apiRouter; 