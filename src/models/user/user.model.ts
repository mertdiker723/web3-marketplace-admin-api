import { type IDistrict, type INeighborhood, type IProvince } from '../location/location.model';

export interface IUserType {
  id: number;
  name: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  openAddress?: string;
  provinceId: number;
  districtId: number;
  neighborhoodId: number;
  createdAt?: Date;
  updatedAt?: Date;
  userType: number;
  userTypes: IUserType;
  provinces?: IProvince;
  districts?: IDistrict;
  neighborhoods?: INeighborhood;
}

export interface IUserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
