import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

import { type IBrand, type IBrandQueryParams } from '../../models/brand/brand.model';
import { BadRequestError } from '../../utils/errors/HttpError';

export class BrandRepository {
  async deleteBrand(id: string) {
    const brand = await prisma.brands.delete({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
    return brand;
  }

  async createBrand(data: Partial<IBrand>) {
    try {
      const brand = await prisma.brands.create({
        data: {
          name: data.name as string,
        },
      });
      return brand;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestError('This brand name already exists');
        }
      }
      throw error;
    }
  }

  async updateBrand(id: string, data: Partial<IBrand>) {
    try {
      const brand = await prisma.brands.update({
        where: { id },
        data: {
          name: data.name as string,
        },
      });
      return brand;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestError('This brand name already exists');
        }
      }
      throw error;
    }
  }

  async getAllBrands(params?: IBrandQueryParams) {
    const { page = 1, limit = 10, search = '' } = params || {};

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where = search
      ? {
          name: { contains: search, mode: 'insensitive' as Prisma.QueryMode },
        }
      : {};

    const totalCount = await prisma.brands.count({ where });

    const brands = await prisma.brands.findMany({
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
      brands,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    };
  }

  async getBrandById(id: string) {
    const brand = await prisma.brands.findUnique({
      where: { id },
    });
    return brand;
  }
}
