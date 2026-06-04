"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ORDER_STATUS_ACTIVE_BG_COLORS,
  ORDER_STATUS_ACTIVE_COLORS,
  ORDER_STATUS_ICON,
  ORDER_STATUS_LABELS,
} from "@/lib/constants/orderStatusLabel";
import { OrderStatus } from "@/lib/interfaces/order";
import { cn } from "@/lib/utils";
import { OrderTable } from "./OrderTable";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function OrdersBase() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<OrderStatus | undefined>(
    (params.get("tab") as OrderStatus | null) ?? OrderStatus.PAYING,
  );
  useEffect(() => {
    if (!currentTab || !window?.history) return;
    const _params = new URLSearchParams(params.toString());
    _params.set("tab", currentTab);
    router.replace(`${pathname}?${_params.toString()}`)
  }, [currentTab]);

  return (
    <Tabs
      defaultValue={OrderStatus.PAYING}
      value={currentTab}
      onValueChange={(i) => setCurrentTab(i as OrderStatus)}
    >
      <TabsList className="py-1 box-content">
        {Object.values(OrderStatus).map((status) => {
          const Icon = ORDER_STATUS_ICON[status];
          return (
            <TabsTrigger
              className={cn(
                "text-base px-4",
                "border-b-2 border-b-transparent",
                ORDER_STATUS_ACTIVE_BG_COLORS[status],
                ORDER_STATUS_ACTIVE_COLORS[status],
              )}
              key={status}
              value={status}
            >
              {ORDER_STATUS_LABELS[status]}
              <Icon size={16} />
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.values(OrderStatus).map((status) => {
        return (
          <TabsContent key={status} value={status}>
            <OrderTable status={status} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
