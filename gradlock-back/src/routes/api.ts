import express from 'express';
import { RoomsController } from '../controllers/roomsController';
import { ReservationsController } from '../controllers/reservationsController';
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

apiRouter.get(
  '/reservations/search',
  authenticate,
  authorization([UserType.STUDENT, UserType.TEACHER, UserType.ADMIN]),
  ReservationsController.getReservationsByFilter,
);
apiRouter.get(
  '/reservations/',
  authenticate,
  authorization([UserType.ADMIN]),
  ReservationsController.getAllReservations,
);

apiRouter.post('/rooms', authenticate, authorization(), RoomsController.createRoom);
apiRouter.put('/rooms/:id', authenticate, authorization(), RoomsController.updateRoom);
apiRouter.delete('/rooms/:id', authenticate, authorization(), RoomsController.deleteRoom);

apiRouter.post('/reservations', authenticate, authorization(), ReservationsController.createReservation);
apiRouter.delete('/reservations/:id', authenticate, authorization(), ReservationsController.deleteReservation);
export default apiRouter;
