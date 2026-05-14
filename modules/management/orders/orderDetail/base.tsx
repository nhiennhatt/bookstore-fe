"use client";

import Link from "next/link";
import { ArrowLeft, Mail, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MANAGEMENT_BASE } from "@/lib/constants/management-nav";
import type { OrderDto } from "@/lib/interfaces/order";
import { cn } from "@/lib/utils/cn";
import { formatOrderPrice } from "@/modules/consumer/Order/orderFormat";
import { getOrderStatusInfo } from "@/modules/consumer/Order/orderStatus";
import { toast } from "sonner";
import { ManagementOrderItemsSection } from "./ManagementOrderItemsSection";
import { ManagementOrderShippingSection } from "./ManagementOrderShippingSection";

type Props = {
  order: OrderDto;
};

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function ManagementInvoiceSummary({
  order,
}: {
  order: Pick<
    OrderDto,
    | "paymentCode"
    | "deliveryCode"
    | "subtotalPrice"
    | "shippingFee"
    | "shippingDiscount"
    | "orderDiscount"
    | "grandTotal"
  >;
}) {
  return (
    <section className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold">Hóa đơn</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="font-medium tabular-nums">
            {formatOrderPrice(order.subtotalPrice)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className="font-medium tabular-nums">
            {formatOrderPrice(order.shippingFee)}
          </span>
        </div>
        {order.shippingDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá vận chuyển</span>
            <span className="font-medium tabular-nums">
              -{formatOrderPrice(order.shippingDiscount)}
            </span>
          </div>
        )}
        {order.orderDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá đơn hàng</span>
            <span className="font-medium tabular-nums">
              -{formatOrderPrice(order.orderDiscount)}
            </span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between items-baseline">
          <span className="font-semibold">Tổng cộng</span>
          <span className="text-xl font-bold tabular-nums text-primary">
            {formatOrderPrice(order.grandTotal)}
          </span>
        </div>
      </div>
    </section>
  );
}

function ManagementCustomerCard({ order }: { order: OrderDto }) {
  const { user } = order;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <section className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <User className="size-5 text-muted-foreground" />
        Khách hàng
      </h2>
      <div className="space-y-3 text-sm">
        {fullName ? (
          <p className="font-medium">{fullName}</p>
        ) : null}
        <div className="flex items-start gap-2 text-muted-foreground">
          <Mail className="size-4 mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground font-medium">{user.email}</p>
            <p className="text-xs">@{user.username}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OrderDetailBase({ order }: Props) {
  const statusInfo = getOrderStatusInfo(order.status);
  const paymentCode = order.paymentCode?.trim() || "—";
  const deliveryCode = order.deliveryCode?.trim() || "—";

  const handleCopyCode = async (value?: string, label?: string) => {
    if (!value?.trim()) {
      toast.error(`Không có ${label ?? "mã"} để sao chép`);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Đã sao chép ${label ?? "mã"}`);
    } catch {
      toast.error("Không thể sao chép, vui lòng thử lại");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="space-y-2">
        <Link
          href={`${MANAGEMENT_BASE}/orders`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách đơn
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="break-all font-mono text-xl font-semibold tracking-tight sm:text-2xl">
              {order.id}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Đặt lúc: <span className="font-mono font-medium">{formatDateTime(order.createdAt)}</span>
            </p>
            <div className="mt-3 gap-1.5 flex items-center sm:gap-3">
              <div className="text-muted-foreground">
                <p>Mã thanh toán:</p>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto p-0 font-mono text-left font-medium text-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() =>
                    void handleCopyCode(order.paymentCode, "mã thanh toán")
                  }
                >
                  {paymentCode}
                </Button>
              </div>
              <Separator orientation="vertical" />
              <div className="text-muted-foreground">
                <p>Mã vận đơn:</p>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto p-0 font-mono text-left font-medium text-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() =>
                    void handleCopyCode(order.deliveryCode, "mã vận đơn")
                  }
                >
                  {deliveryCode}
                </Button>
              </div>
            </div>
          </div>
          <Badge
            className={cn(
              "w-fit gap-1.5 border px-3 py-1.5 text-xs font-medium shadow-none",
              statusInfo.color,
            )}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <ManagementCustomerCard order={order} />
          <ManagementOrderItemsSection orderDetails={order.orderDetails} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <ManagementOrderShippingSection address={order.address} />
          <ManagementInvoiceSummary order={order} />
        </div>
      </div>
    </div>
  );
}
