import { notFound } from "next/navigation";

import { OrderDetailBase } from "@/modules/management/orders/orderDetail/base";
import { getOrderById } from "@/services/orders";

export default async function ManagementOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: order, error } = await getOrderById(id);
  if (error || !order) {
    console.error(error);
    return notFound();
  }

  return <OrderDetailBase order={order} />;
}
