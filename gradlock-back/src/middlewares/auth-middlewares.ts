import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload } from '../types/auth';
import { NextFunction, Response } from 'express';
import { ForbiddenError, InvalidCredentialsError } from '../errors/httpErrors';
import { securityConfig } from '../config/baseConfig';
import { UserType } from '../../generated/prisma';

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const [bearer, accessToken] = req.headers.authorization?.split(' ') ?? [];

  if (bearer !== 'Bearer') {
    next(new InvalidCredentialsError('Formatação inválida para header Authorization.'));
  }

  if (!accessToken) {
    next(new InvalidCredentialsError('accessToken faltando.'));
  }

  try {
    req.user = jwt.verify(accessToken, securityConfig.jwtSecret) as JwtPayload;
    next();
  } catch {
    next(new InvalidCredentialsError('Credenciais inválidas.'));
  }
};

export const authorization =
  (userTypes: UserType[] = []) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (
      req.user?.userType !== UserType.ADMIN &&
      !userTypes.includes(req.user?.userType as UserType)
    ) {
      next(new ForbiddenError('Acesso negado.'));
    }

    next();
  };
