import express from 'express';
import { RoomsController } from '../controllers/roomsController';
import { authenticate, authorization } from '../middlewares/auth-middlewares';
import { UserType } from '../../generated/prisma';

const apiRouter = express.Router();

apiRouter.get(
  '/rooms',
  authenticate,
  authorization([UserType.STUDENT, UserType.TEACHER]),
  RoomsController.getAllRooms,
);
apiRouter.get(
  '/rooms/:id',
  authenticate,
  authorization([UserType.STUDENT, UserType.TEACHER]),
  RoomsController.getRoomById,
);
apiRouter.post('/rooms', authenticate, authorization(), RoomsController.createRoom);
apiRouter.put('/rooms/:id', authenticate, authorization(), RoomsController.updateRoom);
apiRouter.delete('/rooms/:id', authenticate, authorization(), RoomsController.deleteRoom);

export default apiRouter;
