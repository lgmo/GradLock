import express from 'express';
import { ReservationsController } from '../../controllers/reservationsController';
import { authenticate, authorization } from '../../middlewares/auth-middlewares';
import { UserType } from '../../../generated/prisma';

const reservationRouter = express.Router();

reservationRouter.get(
  '/search',
  authenticate,
  authorization([UserType.STUDENT, UserType.TEACHER, UserType.ADMIN]),
  ReservationsController.getReservationsByFilter,
);
reservationRouter.get(
  '',
  authenticate,
  authorization([UserType.ADMIN]),
  ReservationsController.getAllReservations,
);

export default reservationRouter;