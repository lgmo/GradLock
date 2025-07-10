import express from 'express';
import { RoomsController } from '../controllers/roomsController';

const apiRouter = express.Router();

apiRouter.get('/rooms', RoomsController.getAllRooms);
apiRouter.get('/rooms/:id', RoomsController.getRoomById);

export default apiRouter;