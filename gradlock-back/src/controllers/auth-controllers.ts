import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth-service';
import { authCredentialsSchema } from '../validators/auth-validators';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const authTokens = await authService.login(req.body);
      res.status(200).json(authTokens);
    } catch (error) {
      next(error);
    }
  },
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authTokens = await authService.refresh(req.body);
      res.status(200).json(authTokens);
    } catch (error) {
      next(error);
    }
  },
};
