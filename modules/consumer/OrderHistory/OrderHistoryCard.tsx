import type { OrderOverviewDto } from "@/lib/interfaces/order";
import { formatOrderPrice } from "@/modules/consumer/Order/orderFormat";
import { Calendar, ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { OrderStatusBadge } from "./OrderStatusBadge";

function formatGrandTotal(grandTotal: number | undefined) {
  return grandTotal != null ? formatOrderPrice(grandTotal) : "Đang cập nhật";
}

export function OrderHistoryCard({ order }: { order: OrderOverviewDto }) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="block bg-white rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-vapor-white flex items-center justify-center text-electric-indigo shrink-0">
            <Package size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-deep-charcoal">{order.id}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-cool-slate font-medium flex items-center gap-1">
                <Calendar size={12} />
                {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-[10px] text-cool-slate font-medium truncate max-w-[250px]">
                {order.address.address}, {order.address.ward},{" "}
                {order.address.district}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-bold text-cool-slate uppercase tracking-widest mb-1">
              Tổng cộng
            </span>
            <span className="font-bold text-electric-indigo">
              {formatGrandTotal(order.grandTotal)}
            </span>
          </div>
          <div className="p-2 rounded-full bg-vapor-white text-cool-slate group-hover:bg-electric-indigo group-hover:text-white transition-colors">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}
