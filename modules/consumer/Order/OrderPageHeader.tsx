"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderDto } from "@/lib/interfaces/order";
import { OrderStatus } from "@/lib/interfaces/order";
import { cn } from "@/lib/utils";
import { getOrderStatusInfo } from "./orderStatus";

type Props = {
  order: Pick<OrderDto, "id" | "status">;
  setActivePayment: (active: boolean) => void;
};

export function OrderPageHeader({ order, setActivePayment }: Props) {
  const statusInfo = getOrderStatusInfo(order.status);

  return (
    <header className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-cool-slate text-sm font-medium mb-6">
          <Link
            href="/profile"
            className="hover:text-deep-charcoal transition-colors flex items-center gap-1.5 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Hồ sơ của tôi
          </Link>
          <span className="text-cool-slate/30">/</span>
          <span className="text-deep-charcoal font-semibold">
            Đơn hàng {order.id}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-deep-charcoal mb-3">
              Đơn hàng: {order.id}
            </h1>
            <div className="flex items-center gap-3">
              <Badge
                className={cn(
                  "px-3 py-1.5 border font-bold uppercase tracking-widest text-[10px] gap-2 shadow-none",
                  statusInfo.color,
                )}
              >
                {statusInfo.icon}
                {statusInfo.label}
              </Badge>
              <span className="text-sm text-cool-slate font-medium flex items-center gap-1.5">
                <Calendar size={14} />
                Đặt ngày: 18/04/2024
              </span>
            </div>
          </div>

          {order.status === OrderStatus.PAYING && (
            <Button
              className="rounded-xl bg-electric-indigo text-white px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs gap-3 shadow-lg shadow-electric-indigo/20"
              onClick={() => setActivePayment(true)}
            >
              Thanh toán ngay
            </Button>
          )}
        </div>
      </motion.div>
    </header>
  );
}
