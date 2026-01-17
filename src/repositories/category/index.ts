import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

import { type ICategory, type ICategoryQueryParams } from '../../models/category/category.model';
import { BadRequestError } from '../../utils/errors/HttpError';

export class CategoryRepository {
  async getAllCategories(params?: ICategoryQueryParams) {
    const { page = 1, limit = 10, search = '' } = params || {};

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where = search
      ? {
          name: { contains: search, mode: 'insensitive' as Prisma.QueryMode },
        }
      : {};

    const totalCount = await prisma.categories.count({ where });

    const categories = await prisma.categories.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      categories,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    };
  }

  async getCategoryById(id: string) {
    const category = await prisma.categories.findUnique({
      where: { id },
    });
    return category;
  }

  async createCategory(data: Partial<ICategory>) {
    try {
      const category = await prisma.categories.create({
        data: {
          name: data.name as string,
        },
      });
      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestError('This category name already exists');
        }
      }
      throw error;
    }
  }

  async updateCategory(id: string, data: Partial<ICategory>) {
    try {
      const category = await prisma.categories.update({
        where: { id },
        data: {
          name: data.name as string,
        },
      });
      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestError('This category name already exists');
        }
      }
      throw error;
    }
  }

  async deleteCategory(id: string) {
    const category = await prisma.categories.delete({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
    return category;
  }
}
