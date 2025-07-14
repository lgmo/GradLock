import { createUserSchema } from '../validators/user-validators';
import userService from '../services/user-service';
import { UserType } from '../../generated/prisma';
import { NextFunction, Request, Response } from 'express';

const userController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body;
      const userType = user.userType === 'student' ? UserType.STUDENT : UserType.TEACHER;

      const newUser = await userService.createUser({
        ...user,
        userType: userType,
      });
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
