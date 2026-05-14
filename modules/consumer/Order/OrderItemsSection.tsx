"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import type { OrderDetailDto } from "@/lib/interfaces/order";
import { formatOrderPrice } from "./orderFormat";

type Props = {
  orderDetails: OrderDetailDto[];
};

export function OrderItemsSection({ orderDetails }: Props) {
  return (
    <section className="bg-white rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-deep-charcoal flex items-center gap-3">
        <Package size={20} className="text-electric-indigo" />
        Sản phẩm đã chọn
      </h2>
      <div className="divide-y divide-border/30">
        {orderDetails.map((item) => (
          <div
            key={item.id}
            className="py-6 first:pt-0 last:pb-0 flex gap-6"
          >
            <div className="w-20 aspect-3/4 rounded-lg overflow-hidden bg-muted shrink-0 shadow-sm border border-border/10">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.bookName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="grow min-w-0">
              <Link
                href={`/books/${item.bookSlug}`}
                className="hover:text-electric-indigo transition-colors"
              >
                <h4 className="font-bold text-deep-charcoal text-lg line-clamp-1">
                  {item.bookName}
                </h4>
              </Link>
              <p className="text-sm text-cool-slate font-medium mb-3">
                Phiên bản:{" "}
                <span className="text-deep-charcoal">{item.variantName}</span> ·
                SL: {item.quantity}
              </p>
              <div className="flex justify-between items-end">
                <div className="flex gap-2">
                  <span className="text-sm font-bold text-deep-charcoal">
                    {formatOrderPrice(item.unitPrice)}
                  </span>
                  {item.originUnitPrice > item.unitPrice && (
                    <span className="text-xs text-cool-slate line-through opacity-50 font-medium">
                      {formatOrderPrice(item.originUnitPrice)}
                    </span>
                  )}
                </div>
                <span className="font-bold text-deep-charcoal">
                  {formatOrderPrice(item.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
