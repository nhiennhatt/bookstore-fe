import { OrderStatus } from "../interfaces/order";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CreditCard,
  Loader,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PAYING]: "Chờ thanh toán",
  [OrderStatus.PREPARING]: "Đang đóng gói",
  [OrderStatus.PREPARED]: "Đã đóng gói",
  [OrderStatus.SHIPPING]: "Đang giao hàng",
  [OrderStatus.DONE]: "Đã hoàn thành",
  [OrderStatus.CANCELLED]: "Đã hủy",
};

export const ORDER_STATUS_ACTIVE_BG_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PAYING]: "data-[state=active]:bg-amber-50",
  [OrderStatus.PREPARING]: "data-[state=active]:bg-blue-50",
  [OrderStatus.PREPARED]: "data-[state=active]:bg-teal-50",
  [OrderStatus.SHIPPING]: "data-[state=active]:bg-violet-50",
  [OrderStatus.DONE]: "data-[state=active]:bg-green-50",
  [OrderStatus.CANCELLED]: "data-[state=active]:bg-red-50",
};

export const ORDER_STATUS_BG_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PAYING]: "bg-amber-50",
  [OrderStatus.PREPARING]: "bg-blue-50",
  [OrderStatus.PREPARED]: "bg-teal-50",
  [OrderStatus.SHIPPING]: "bg-violet-50",
  [OrderStatus.DONE]: "bg-green-50",
  [OrderStatus.CANCELLED]: "bg-red-50",
};

export const ORDER_STATUS_ACTIVE_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PAYING]: "data-[state=active]:text-amber-700",
  [OrderStatus.PREPARING]: "data-[state=active]:text-blue-700",
  [OrderStatus.PREPARED]: "data-[state=active]:text-teal-700",
  [OrderStatus.SHIPPING]: "data-[state=active]:text-violet-700",
  [OrderStatus.DONE]: "data-[state=active]:text-green-700",
  [OrderStatus.CANCELLED]: "data-[state=active]:text-red-700",
};


export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PAYING]: "text-amber-700",
  [OrderStatus.PREPARING]: "text-blue-700",
  [OrderStatus.PREPARED]: "text-teal-700",
  [OrderStatus.SHIPPING]: "text-violet-700",
  [OrderStatus.DONE]: "text-green-700",
  [OrderStatus.CANCELLED]: "text-red-700",
};

export const ORDER_STATUS_BORDER_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PAYING]: "border-amber-700",
  [OrderStatus.PREPARING]: "border-blue-700",
  [OrderStatus.PREPARED]: "border-teal-700",
  [OrderStatus.SHIPPING]: "border-violet-700",
  [OrderStatus.DONE]: "border-green-700",
  [OrderStatus.CANCELLED]: "border-red-700",
};

export const ORDER_STATUS_ICON: Record<OrderStatus, LucideIcon> = {
  [OrderStatus.PAYING]: CreditCard,
  [OrderStatus.PREPARING]: Loader,
  [OrderStatus.PREPARED]: Package,
  [OrderStatus.SHIPPING]: Truck,
  [OrderStatus.DONE]: BadgeCheck,
  [OrderStatus.CANCELLED]: XCircle,
};
