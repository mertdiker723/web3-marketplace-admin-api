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
}
