import { BookVariantStatus } from "./bookVariant";
import { Category } from "./category";

export enum BookStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMING_SOON = "COMING_SOON",
  DISCONTINUED = "DISCONTINUED",
}

export interface Book {
  id: string;
  name: string;
  author?: string;
  publisher?: string;
  distributor?: string;
  slug: string;
  description?: string;
  status: BookStatus;
  properties?: string | Record<string, any>;
  image?: string;
  categoryId?: string;
  category?: Category;
  stock?: number;
}

export interface BookDetail extends Omit<Book, "categoryId"> {
  category?: Category;
  stock?: number;
}

export interface BookOverview {
  id: string;
  name: string;
  author?: string;
  publisher?: string;
  distributor?: string;
  slug: string;
  status: BookStatus;
  image?: string;
  categoryName?: string;
  salePrice?: number;
  validStock?: number;
  totalStock?: number;
  variantStatus?: BookVariantStatus;
}
