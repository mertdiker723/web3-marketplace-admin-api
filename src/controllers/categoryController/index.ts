import type { Request, Response } from 'express';

import { CategoryService } from '../../services/category';

export class CategoryController {
  #categoryService: CategoryService;

  constructor() {
    this.#categoryService = new CategoryService();
  }

  createCategory = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#categoryService.createCategory(req.body);
      res.status(201).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const { data, pagination, message, success } = await this.#categoryService.getAllCategories(req.query);
      res.status(200).json({ data, pagination, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#categoryService.getCategoryById(req.params.id);
      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#categoryService.updateCategory(req.params.id, req.body);
      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#categoryService.deleteCategory(req.params.id);
      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };
}
