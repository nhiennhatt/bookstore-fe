"use client";

import {
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { OrderStatus } from "@/lib/interfaces/order";

export type OrderStatusInfo = {
  icon: ReactNode;
  label: string;
  color: string;
};

export function getOrderStatusInfo(status: OrderStatus): OrderStatusInfo {
  switch (status) {
    case OrderStatus.PAYING:
      return {
        icon: <Clock size={16} />,
        label: "Chờ thanh toán",
        color: "bg-amber-50 text-amber-600 border-amber-200",
      };
    case OrderStatus.SHIPPING:
      return {
        icon: <Truck size={16} />,
        label: "Đang giao hàng",
        color: "bg-blue-50 text-blue-600 border-blue-200",
      };
    case OrderStatus.DONE:
      return {
        icon: <CheckCircle2 size={16} />,
        label: "Đã hoàn thành",
        color: "bg-green-50 text-green-600 border-green-200",
      };
    case OrderStatus.CANCELLED:
      return {
        icon: <XCircle size={16} />,
        label: "Đã hủy",
        color: "bg-red-50 text-red-600 border-red-200",
      };
    default:
      return {
        icon: null,
        label: status,
        color: "bg-muted text-foreground",
      };
  }
}
