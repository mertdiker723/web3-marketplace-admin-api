// Models
import { type ICategory, type ICategoryQueryParams } from '../../models/category/category.model';

// Utils
import { BadRequestError, NotFoundError } from '../../utils/errors/HttpError';

// Repositories
import { CategoryRepository } from '../../repositories/category';

// Utils
import { handleValidationZodError } from '../../utils/helpers';

// Validations
import { createCategorySchema } from '../../validations/category/category.validation';

export class CategoryService {
  #categoryRepository: CategoryRepository;

  constructor() {
    this.#categoryRepository = new CategoryRepository();
  }

  createCategory = async (data: Partial<ICategory>) => {
    const validatedData = createCategorySchema.safeParse(data);

    if (!validatedData.success) {
      throw new BadRequestError(handleValidationZodError(validatedData.error));
    }

    const { name } = validatedData.data || {};

    const categoryData: Partial<ICategory> = {
      name,
    };

    const category = await this.#categoryRepository.createCategory(categoryData);

    return {
      data: category,
      message: 'Category created successfully',
      success: true,
    };
  };

  getAllCategories = async (params?: ICategoryQueryParams) => {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search || '';

    const { categories, pagination } = await this.#categoryRepository.getAllCategories({ page, limit, search });

    if (!categories || categories.length === 0) {
      throw new NotFoundError('No categories found');
    }

    return {
      data: categories,
      pagination,
      message: 'Categories fetched successfully',
      success: true,
    };
  };

  getCategoryById = async (id: string) => {
    if (!id) {
      throw new BadRequestError('Category ID is required');
    }

    const category = await this.#categoryRepository.getCategoryById(id);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return {
      data: category,
      message: 'Category fetched successfully',
      success: true,
    };
  };

  updateCategory = async (id: string, data: Partial<ICategory>) => {
    const validatedData = createCategorySchema.safeParse(data);

    if (!validatedData.success) {
      throw new BadRequestError(handleValidationZodError(validatedData.error));
    }

    if (!id) {
      throw new BadRequestError('Category ID is required');
    }

    const category = await this.#categoryRepository.updateCategory(id, validatedData.data);

    return {
      data: category,
      message: 'Category updated successfully',
      success: true,
    };
  };

  deleteCategory = async (id: string) => {
    if (!id) {
      throw new BadRequestError('Category ID is required');
    }

    const category = await this.#categoryRepository.deleteCategory(id);

    return {
      data: category,
      message: 'Category deleted successfully',
      success: true,
    };
  };
}
