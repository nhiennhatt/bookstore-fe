export enum BookVariantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface BookVariant {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  isbn: string;
  originPrice?: number;
  salePrice?: number;
  inventory?: number;
  image?: string;
  weight?: number;
  status: BookVariantStatus;
  bookId: string;
}
