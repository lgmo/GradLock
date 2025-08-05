import { Request } from 'express';
import { UserType } from 'generated/prisma';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type JwtPayload = {
  userId: number;
  userType?: UserType;
  exp?: number;
};

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
