import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

import { type IUser, type IUserQueryParams } from '../../models/user/user.model';
import { BadRequestError } from '../../utils/errors/HttpError';

export class UserRepository {
  async findUserById(id: string) {
    const user = await prisma.users.findUnique({
      where: { id },
      omit: {
        password: true,
        provinceId: true,
        districtId: true,
        neighborhoodId: true,
      },
      include: {
        userTypes: true,
        provinces: true,
        districts: {
          select: {
            id: true,
            name: true,
          },
        },
        neighborhoods: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user;
  }

  async getAllUsers(params?: IUserQueryParams) {
    const { page = 1, limit = 5, search = '' } = params || {};

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { lastName: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          ],
        }
      : {};

    const totalCount = await prisma.users.count({ where });

    const users = await prisma.users.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        openAddress: true,
        createdAt: true,
        updatedAt: true,
        password: false,
        userTypes: true,
        provinces: true,
        districts: {
          select: {
            id: true,
            name: true,
          },
        },
        neighborhoods: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      users,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    };
  }

  async updateUser(id: string, data: Partial<IUser>) {
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        userType: data.userType,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      omit: {
        password: true,
      },
    });
    return { data: updatedUser };
  }

  async deleteUser(id: string) {
    const data = await prisma.users.delete({
      where: { id },
      omit: {
        password: true,
      },
    });
    return { data };
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
