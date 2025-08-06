import express from 'express';
import { RoomsController } from '../../controllers/roomsController';
import { authenticate, authorization } from '../../middlewares/auth-middlewares';
import { UserType } from '../../../generated/prisma';

const roomRouter = express.Router();

roomRouter.get(
  '',
  authenticate,
  authorization([UserType.STUDENT, UserType.TEACHER]),
  RoomsController.getAllRooms,
);
roomRouter.get(
  '/:id',
  authenticate,
  authorization([UserType.STUDENT, UserType.TEACHER]),
  RoomsController.getRoomById,
);
roomRouter.post('', authenticate, authorization(), RoomsController.createRoom);
roomRouter.put('/:id', authenticate, authorization(), RoomsController.updateRoom);
roomRouter.delete('/:id', authenticate, authorization(), RoomsController.deleteRoom);

export default roomRouter;
