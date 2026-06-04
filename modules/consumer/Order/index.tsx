"use client";

import { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import { OrderDto } from "@/lib/interfaces/order";
import { OrderStatus } from "@/lib/interfaces/order";
import { getOrderById } from "@/services/orders";
import { OrderInvoiceSection } from "./OrderInvoiceSection";
import { OrderItemsSection } from "./OrderItemsSection";
import { OrderPageHeader } from "./OrderPageHeader";
import { OrderShippingSection } from "./OrderShippingSection";
import { PaymentInfoSection } from "./PaymentInfoSection";

export function Order({ id }: { id: string }) {
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [activePayment, setActivePayment] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getOrderById(id);
      if (response.error || !response.data) return;
      setOrder(response.data);
      console.log(response.data)
    };
    fetchOrder().finally(() => setLoadingOrder(false));
  }, [id]);

  if (loadingOrder) {
    return <div>Loading...</div>;
  }

  if (!order) {
    notFound();
    return null;
  }

  return (
    <main className="grow py-16 px-4 md:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <OrderPageHeader order={order} setActivePayment={setActivePayment} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {order.status === OrderStatus.PAYING && (
              <PaymentInfoSection
                orderId={order.id}
                setActivePayment={setActivePayment}
                activePayment={activePayment}
              />
            )}

            <OrderItemsSection orderDetails={order.orderDetails} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <OrderShippingSection address={order.address} />
            <OrderInvoiceSection order={order} />
          </div>
        </div>
      </div>
    </main>
  );
}
