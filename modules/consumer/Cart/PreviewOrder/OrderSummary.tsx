"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderDto } from "@/lib/interfaces/order";
import { PleaseSelectAddress } from "./PleaseSelectAddress";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  previewOrder: OrderDto | null;
  selectedAddressId: string | null;
  handleCreateOrder: () => void;
  isCreatingOrder: boolean;
}

export function OrderSummary({
  previewOrder,
  selectedAddressId,
  handleCreateOrder,
  isCreatingOrder,
}: OrderSummaryProps) {
  return (
    <div className="lg:col-span-4">
      <div className="bg-white rounded-3xl border border-border/50 p-8 shadow-sm sticky top-32 space-y-6">
        <h3 className="text-xl font-bold text-deep-charcoal">
          Tóm tắt đơn hàng
        </h3>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
          {previewOrder?.orderDetails.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 aspect-3/4 rounded-lg overflow-hidden bg-muted shrink-0 shadow-sm border border-border/10">
                <img
                  src={item.image}
                  alt={item.bookName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-deep-charcoal line-clamp-1">
                  {item.bookName}
                </h4>
                <p className="text-[10px] text-cool-slate font-medium mb-1">
                  Sl: {item.quantity} · {item.variantName}
                </p>
                <span className="text-sm font-bold text-deep-charcoal">
                  {formatPrice(item.unitPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-border/30" />

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-cool-slate font-medium">Phí giao hàng</span>
            <span className="text-deep-charcoal font-bold">
              {previewOrder?.shippingFee && selectedAddressId
                ? formatPrice(previewOrder.shippingFee)
                : <PleaseSelectAddress />}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cool-slate font-medium">Tạm tính</span>
            <span className="text-deep-charcoal font-bold">
              {previewOrder?.subtotalPrice &&
                formatPrice(previewOrder.subtotalPrice)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cool-slate font-medium">
              Giảm giá đơn hàng
            </span>
            <span className="font-bold text-red-500">
              {previewOrder?.orderDiscount &&
                "- " + formatPrice(previewOrder.orderDiscount)}
            </span>
          </div>
          {previewOrder && previewOrder.shippingDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="font-medium">Giảm giá vận chuyển</span>
              <span className="font-bold">
                -{formatPrice(previewOrder.shippingDiscount)}
              </span>
            </div>
          )}
        </div>

        <Separator className="bg-border/30" />

        <div className="flex justify-between items-baseline mb-2">
          <span className="text-lg font-bold text-deep-charcoal">
            Tổng cộng
          </span>
          <span className="text-3xl font-bold text-electric-indigo tracking-tight">
            {previewOrder?.grandTotal && selectedAddressId
              ? formatPrice(previewOrder.grandTotal)
              : <PleaseSelectAddress />}
          </span>
        </div>

        <Button
          onClick={handleCreateOrder}
          disabled={isCreatingOrder || !selectedAddressId}
          className="w-full h-14 rounded-xl bg-deep-charcoal hover:bg-deep-charcoal/90 text-white font-bold uppercase tracking-widest text-xs gap-3 shadow-lg shadow-deep-charcoal/10 disabled:opacity-70"
        >
          {isCreatingOrder ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          {!isCreatingOrder && <ChevronRight size={18} />}
        </Button>
      </div>
    </div>
  );
}
