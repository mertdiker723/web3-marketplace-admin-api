export interface IBrand {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBrandQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
