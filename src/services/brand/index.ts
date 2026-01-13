// Models
import { type IBrand, type IBrandQueryParams } from '../../models/brand/brand.model';

// Utils
import { BadRequestError, NotFoundError } from '../../utils/errors/HttpError';

// Repositories
import { BrandRepository } from '../../repositories/brand';

// Utils
import { handleValidationZodError } from '../../utils/helpers';

// Validations
import { brandSchema } from '../../validations/brand/brand.validation';

export class BrandService {
  #brandRepository: BrandRepository;

  constructor() {
    this.#brandRepository = new BrandRepository();
  }

  createBrand = async (data: Partial<IBrand>) => {
    const validatedData = brandSchema.safeParse(data);

    if (!validatedData.success) {
      throw new BadRequestError(handleValidationZodError(validatedData.error));
    }

    const { name } = validatedData.data || {};

    const brandData: Partial<IBrand> = {
      name,
    };

    const brand = await this.#brandRepository.createBrand(brandData);

    return {
      data: brand,
      message: 'Brand created successfully',
      success: true,
    };
  };

  updateBrand = async (id: string, data: Partial<IBrand>) => {
    if (!id) {
      throw new BadRequestError('Brand ID is required');
    }
    const validatedData = brandSchema.safeParse(data);

    if (!validatedData.success) {
      throw new BadRequestError(handleValidationZodError(validatedData.error));
    }
    const { name } = validatedData.data || {};

    const brandData: Partial<IBrand> = {
      name,
    };

    const brand = await this.#brandRepository.updateBrand(id, brandData);
    if (!brand) {
      throw new NotFoundError('Brand not found');
    }
    return {
      data: brand,
      message: 'Brand updated successfully',
      success: true,
    };
  };
  getAllBrands = async (params?: IBrandQueryParams) => {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search || '';

    const { brands, pagination } = await this.#brandRepository.getAllBrands({ page, limit, search });

    if (!brands || brands.length === 0) {
      throw new NotFoundError('No brands found');
    }

    return {
      data: brands,
      pagination,
      message: 'Brands fetched successfully',
      success: true,
    };
  };

  deleteBrand = async (id: string) => {
    if (!id) {
      throw new BadRequestError('Brand ID is required');
    }
    const brand = await this.#brandRepository.deleteBrand(id);

    if (!brand) {
      throw new NotFoundError('Brand not found');
    }

    return {
      data: brand,
      message: 'Brand deleted successfully',
      success: true,
    };
  };

  getBrandById = async (id: string) => {
    if (!id) {
      throw new BadRequestError('Brand ID is required');
    }
    const brand = await this.#brandRepository.getBrandById(id);
    if (!brand) {
      throw new NotFoundError('Brand not found');
    }

    return {
      data: brand,
      message: 'Brand fetched successfully',
      success: true,
    };
  };
}
