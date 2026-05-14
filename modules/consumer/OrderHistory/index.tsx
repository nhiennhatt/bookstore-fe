"use client";

import { motion } from "motion/react";
import type { OrderOverviewDto } from "@/lib/interfaces/order";
import { getMyOrders } from "@/services/me/getMyOrders";
import { useEffect, useState } from "react";
import { OrderHistoryCard } from "./OrderHistoryCard";
import { OrderHistoryEmptyState } from "./OrderHistoryEmptyState";
import { OrderHistoryHeader } from "./OrderHistoryHeader";

export function OrderHistory() {
  const [orders, setOrders] = useState<OrderOverviewDto[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getMyOrders();
      if (response.error || !response.data) {
        console.error(response.error);
        return;
      }
      setOrders(response.data ?? []);
    };
    fetchOrders();
  }, []);

  return (
    <main className="grow py-16 px-4 md:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <OrderHistoryHeader />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {orders.length === 0 ? (
            <OrderHistoryEmptyState />
          ) : (
            orders.map((order) => (
              <OrderHistoryCard key={order.id} order={order} />
            ))
          )}
        </motion.div>
      </div>
    </main>
  );
}
