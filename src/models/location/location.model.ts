export interface IProvince {
  id: number;
  name: string;
}

export interface IDistrict {
  id: number;
  name: string;
  provinceId: number;
}

export interface INeighborhood {
  id: number;
  name: string;
  districtId: number;
  provinceId: number;
}
