import prisma from '../../config/prisma';
import type { IProvince } from '../../models/location/location.model';

export class LocationRepository {
  async getAllProvinces(): Promise<IProvince[]> {
    const provinces = await prisma.provinces.findMany();
    return provinces;
  }

  async getDistrictsByProvinceId(provinceId: number) {
    const districts = await prisma.districts.findMany({
      where: {
        provinceId,
      },
    });
    return districts;
  }

  async getNeighborhoodsByDistrictId(districtId: number) {
    const neighborhoods = await prisma.neighborhoods.findMany({
      where: {
        districtId,
      },
    });
    return neighborhoods;
  }
}
