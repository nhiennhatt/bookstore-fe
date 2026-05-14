"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { OrderDto } from "@/lib/interfaces/order";
import { OrderStatus } from "@/lib/interfaces/order";
import { formatOrderPrice } from "./orderFormat";

type Props = {
  order: Pick<
    OrderDto,
    | "status"
    | "subtotalPrice"
    | "shippingFee"
    | "shippingDiscount"
    | "orderDiscount"
    | "grandTotal"
  >;
};

export function OrderInvoiceSection({ order }: Props) {
  return (
    <section className="bg-white rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-deep-charcoal">Hóa đơn chi tiết</h2>
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-cool-slate font-medium">Tạm tính</span>
          <span className="text-deep-charcoal font-bold">
            {formatOrderPrice(order.subtotalPrice)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cool-slate font-medium">Phí vận chuyển</span>
          <span className="text-deep-charcoal font-bold">
            {formatOrderPrice(order.shippingFee)}
          </span>
        </div>
        {order.shippingDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="font-medium">Giảm giá vận chuyển</span>
            <span className="font-bold">
              -{formatOrderPrice(order.shippingDiscount)}
            </span>
          </div>
        )}
        {order.orderDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="font-medium">Giảm giá đơn hàng</span>
            <span className="font-bold">
              -{formatOrderPrice(order.orderDiscount)}
            </span>
          </div>
        )}
        <Separator className="bg-border/30" />
        <div className="flex justify-between items-baseline mb-2">
          <span className="font-bold text-deep-charcoal">Tổng cộng</span>
          <span className="text-2xl font-bold text-electric-indigo tracking-tight">
            {formatOrderPrice(order.grandTotal)}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border/10">
        <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-cool-slate/70">
          <ShieldCheck size={14} className="text-green-500" />
          Đã thanh toán an toàn
        </div>
        {order.status === OrderStatus.DONE && (
          <Button
            variant="outline"
            className="w-full rounded-xl border-border h-12 font-bold text-xs uppercase tracking-widest gap-2"
          >
            <ArrowLeft size={14} /> Quay lại trang chủ
          </Button>
        )}
      </div>
    </section>
  );
}
