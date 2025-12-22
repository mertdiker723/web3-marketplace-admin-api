import type { Request, Response } from 'express';

// Services
import { LocationService } from '../../services/location';

// Utils
import { HttpError } from '../../utils/errors/HttpError';

export class LocationController {
  #locationService: LocationService;

  constructor() {
    this.#locationService = new LocationService();

    this.getAllProvinces = this.getAllProvinces.bind(this);
    this.getDistrictsByProvinceId = this.getDistrictsByProvinceId.bind(this);
    this.getNeighborhoodsByDistrictId = this.getNeighborhoodsByDistrictId.bind(this);
  }

  async getAllProvinces(_req: Request, res: Response) {
    try {
      const { data, message, success } = await this.#locationService.getAllProvinces();

      res.status(200).json({
        success,
        data,
        message,
      });
    } catch (error) {
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      res.status(statusCode).json({
        success: false,
        data: null,
        message: error instanceof HttpError ? error.message : 'Unknown error',
      });
    }
  }

  async getDistrictsByProvinceId(req: Request, res: Response) {
    try {
      const { provinceId } = req.params as { provinceId: string };
      const { data, message, success } = await this.#locationService.getDistrictsByProvinceId(provinceId);

      res.status(200).json({
        success,
        data,
        message,
      });
    } catch (error) {
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      res.status(statusCode).json({
        success: false,
        data: null,
        message: error instanceof HttpError ? error.message : 'Unknown error',
      });
    }
  }

  async getNeighborhoodsByDistrictId(req: Request, res: Response) {
    try {
      const { districtId } = req.params as { districtId: string };
      const { data, message, success } = await this.#locationService.getNeighborhoodsByDistrictId(districtId);
      res.status(200).json({
        success,
        data,
        message,
      });
    } catch (error) {
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      res.status(statusCode).json({
        success: false,
        data: null,
        message: error instanceof HttpError ? error.message : 'Unknown error',
      });
    }
  }
}
