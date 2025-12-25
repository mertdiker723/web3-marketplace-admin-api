import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

import { type IUser } from '../../models/user/user.model';
import { BadRequestError } from '../../utils/errors/HttpError';

export class UserRepository {
  async findUserByEmail(email: string) {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user;
  }

  async registerUser(data: Partial<IUser>) {
    const { firstName, lastName, email, password, userType } = data || {};

    try {
      const user = await prisma.users.create({
        data: {
          firstName: firstName as string,
          lastName: lastName as string,
          email: email as string,
          password: password as string,
          userType: userType as number,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestError('This email is already registered');
        }
      }
      throw error;
    }
  }
}
