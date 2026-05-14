"use client";

import Link from "next/link";
import { ExternalLink, Package } from "lucide-react";

import { MANAGEMENT_BASE } from "@/lib/constants/management-nav";
import type { OrderDetailDto } from "@/lib/interfaces/order";
import { formatOrderPrice } from "@/modules/consumer/Order/orderFormat";

type Props = {
  orderDetails: OrderDetailDto[];
};

export function ManagementOrderItemsSection({ orderDetails }: Props) {
  return (
    <section className="space-y-6 rounded-lg border bg-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Package className="size-5 text-muted-foreground" />
        Sản phẩm trong đơn
      </h2>
      <div className="divide-y divide-border">
        {orderDetails.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 py-6 first:pt-0 last:pb-0 sm:gap-6"
          >
            <div className="aspect-3/4 w-16 shrink-0 overflow-hidden rounded-md border bg-muted sm:w-20">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.bookName}
                  className="size-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 grow">
              <Link
                href={`${MANAGEMENT_BASE}/books/${item.bookId}`}
                className="group inline-flex max-w-full items-center gap-1.5 font-medium text-foreground hover:text-primary"
              >
                <span className="line-clamp-2 text-base">{item.bookName}</span>
                <ExternalLink className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <p className="mb-3 mt-1 text-sm text-muted-foreground">
                Phiên bản:{" "}
                <span className="text-foreground">{item.variantName}</span> ·
                SL: {item.quantity}
              </p>
              <p className="mb-3 mt-1 text-sm text-muted-foreground">
                Mã sản phẩm:{" "}
                <span className="text-foreground">{item.variantId}</span>
              </p>
              <div className="flex items-end justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-semibold tabular-nums">
                    {formatOrderPrice(item.unitPrice)}
                  </span>
                  {item.originUnitPrice > item.unitPrice ? (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatOrderPrice(item.originUnitPrice)}
                    </span>
                  ) : null}
                </div>
                <span className="shrink-0 font-semibold tabular-nums">
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
