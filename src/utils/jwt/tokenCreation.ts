import jwt from 'jsonwebtoken';

import { type IUser } from '../../models/user/user.model';

const TOKEN_EXPIRATION_TIME = '1h';

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export const tokenCreation = (payload: Partial<IUser>) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: TOKEN_EXPIRATION_TIME,
  });
  return token;
};
