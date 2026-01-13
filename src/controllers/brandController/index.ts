import type { Request, Response } from 'express';

import { BrandService } from '../../services/brand';

export class BrandController {
  #brandService: BrandService;

  constructor() {
    this.#brandService = new BrandService();
  }

  getAllBrands = async (req: Request, res: Response) => {
    try {
      const { data, pagination, message, success } = await this.#brandService.getAllBrands(req.query);
      res.status(200).json({ data, pagination, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  getBrandById = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#brandService.getBrandById(req.params.id);
      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  createBrand = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#brandService.createBrand(req.body);
      res.status(201).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  deleteBrand = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#brandService.deleteBrand(req.params.id);
      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };
  updateBrand = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#brandService.updateBrand(req.params.id, req.body);
      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };
}
