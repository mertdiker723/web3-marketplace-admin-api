export interface ICategory {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
