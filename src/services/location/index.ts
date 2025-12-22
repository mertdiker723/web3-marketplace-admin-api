import type { IDistrict, INeighborhood, IProvince } from '../../models/location/location.model';
import { LocationRepository } from '../../repositories/location';
import { BadRequestError, NotFoundError } from '../../utils/errors/HttpError';

export class LocationService {
  #locationRepository: LocationRepository;

  constructor() {
    this.#locationRepository = new LocationRepository();
  }

  async getAllProvinces(): Promise<{ data: IProvince[]; message: string; success: boolean }> {
    const provinces = await this.#locationRepository.getAllProvinces();

    if (!provinces || provinces.length === 0) {
      throw new NotFoundError('No provinces found');
    }

    return {
      data: provinces,
      message: 'Provinces fetched successfully',
      success: true,
    };
  }

  async getDistrictsByProvinceId(provinceId: string): Promise<{ data: IDistrict[]; message: string; success: boolean }> {
    const provinceIdNumber = parseInt(provinceId);
    if (isNaN(provinceIdNumber) || provinceIdNumber <= 0 || provinceIdNumber > Number.MAX_SAFE_INTEGER) {
      throw new BadRequestError('Invalid province ID');
    }

    const districts = await this.#locationRepository.getDistrictsByProvinceId(provinceIdNumber);

    if (!districts || districts.length === 0) {
      throw new NotFoundError('No districts found');
    }

    return {
      data: districts,
      message: 'Districts fetched successfully',
      success: true,
    };
  }

  async getNeighborhoodsByDistrictId(districtId: string): Promise<{ data: INeighborhood[]; message: string; success: boolean }> {
    const districtIdNumber = parseInt(districtId);
    if (isNaN(districtIdNumber) || districtIdNumber <= 0 || districtIdNumber > Number.MAX_SAFE_INTEGER) {
      throw new BadRequestError('Invalid district ID');
    }

    const neighborhoods = await this.#locationRepository.getNeighborhoodsByDistrictId(districtIdNumber);

    if (!neighborhoods || neighborhoods.length === 0) {
      throw new NotFoundError('No neighborhoods found');
    }

    return {
      data: neighborhoods,
      message: 'Neighborhoods fetched successfully',
      success: true,
    };
  }
}
