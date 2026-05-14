import type { UserAddress } from "./address";
import type { User } from "./user";

export enum OrderStatus {
  PAYING = "PAYING",
  SHIPPING = "SHIPPING",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}

/** components/schemas/Order */
export interface Order {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  address?: UserAddress;
  addressId?: string;
  userId?: string;
  status: OrderStatus;
  deliveryCode?: string;
  paymentCode?: string;
  totalWeight?: number;
  paymentClientSecret?: string;
  subtotalPrice?: number;
  shippingFee?: number;
  orderDiscount?: number;
  shippingDiscount?: number;
  grandTotal?: number;
}

export interface OrderDetailDto {
  id: string;
  variantId: string;
  bookId: string;
  bookName: string;
  bookSlug: string;
  variantName: string;
  quantity: number;
  originUnitPrice: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

/** Chi tiết đơn (admin / chủ đơn) */
export interface OrderDto {
  id: string;
  user: User;
  address: UserAddress;
  status: OrderStatus;
  subtotalPrice: number;
  shippingFee: number;
  orderDiscount: number;
  shippingDiscount: number;
  grandTotal: number;
  orderDetails: OrderDetailDto[];
  deliveryCode?: string;
  paymentCode?: string;
  /** GET /orders/:id — components/schemas/OrderDto */
  createdAt?: string;
}

/** GET /me/orders */
export interface OrderOverviewDto {
  id: string;
  user?: User;
  address: UserAddress;
  status: OrderStatus;
  subtotalPrice?: number;
  shippingFee?: number;
  orderDiscount?: number;
  shippingDiscount?: number;
  grandTotal?: number;
  createdAt: string;
}

/** POST /orders — CreateOrderValidation */
export interface CreateOrderItemPayload {
  variantId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  variants: CreateOrderItemPayload[];
  addressId: string;
}

export interface CreatePaymentIntentDto {
  clientSecret: string;
}

/** POST /orders/preview - PreviewOrderValidation */
export interface PreviewOrderPayload {
  variants: CreateOrderItemPayload[];
  addressId?: string;
}
