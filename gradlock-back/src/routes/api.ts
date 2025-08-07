import express from 'express';
import authRoutes from './modules/auth-routes';
import userRoutes from './modules/user-routes';
import roomRoutes from './modules/room-routes';
import reservationRouter from './modules/reservation-routes';

const apiRouter = express.Router();

// Montagem das rotas organizadas por domínio
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/rooms', roomRoutes);
apiRouter.use('/reservations', reservationRouter);

export default apiRouter;
  