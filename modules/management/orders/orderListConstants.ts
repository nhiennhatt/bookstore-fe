import { OrderStatus } from "@/lib/interfaces/order";

export const BOOL_ALL_VALUE = "__all__";
export const ORDER_LIST_SEARCH_DEBOUNCE_MS = 400;

export const ORDER_STATUS_OPTIONS = Object.values(OrderStatus) as OrderStatus[];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PAYING]: "Chờ thanh toán",
  [OrderStatus.SHIPPING]: "Đang giao",
  [OrderStatus.DONE]: "Hoàn thành",
  [OrderStatus.CANCELLED]: "Đã hủy",
};
