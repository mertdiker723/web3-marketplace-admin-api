import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { type IUser } from '../models/user/user.model';

import { verifyToken } from '../utils/jwt/tokenCreation';

interface AuthenticatedRequest extends Request {
  user?: Partial<IUser>;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authentication || '';

  const [scheme, token] = (authHeader as string).split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'No token provided', success: false });
  }

  try {
    const { id, email, userType } = verifyToken(token) as Partial<IUser>;

    req.user = { id, email, userType };
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: error instanceof jwt.TokenExpiredError ? 'Token expired' : 'Invalid token',
        success: false,
      });
    }

    return res.status(500).json({ message: (error as Error).message, success: false });
  }
};
