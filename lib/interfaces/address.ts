/** Khớp components/schemas/UserAddress */
export interface UserAddress {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  province: string;
  district: string;
  ward: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
  address: string;
  phone: string;
  name: string;
  /** Khớp JSON `default` từ API */
  default: boolean;
}

export interface ProvinceDto {
  id: number;
  name: string;
}

export interface DistrictDto {
  id: number;
  name: string;
  provinceId: number;
}

export interface WardDto {
  name: string;
  code: string;
  districtId: number;
}

/** POST /me/addresses — CreateAddressValidation */
export interface CreateAddressPayload {
  provinceId: number;
  districtId: number;
  wardCode: string;
  address: string;
  phone: string;
  name: string;
}
