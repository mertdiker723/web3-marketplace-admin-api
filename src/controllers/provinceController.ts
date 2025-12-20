import type { Request, Response } from 'express';
import prisma from '../config/dbConnection';

export class ProvinceController {
  async getAllProvinces(_req: Request, res: Response) {
    try {
      const provinces = await prisma.provinces.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      res.json({
        success: true,
        data: provinces,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch provinces',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
