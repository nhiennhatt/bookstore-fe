import { Order } from "@/modules/consumer/Order";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Order id={id} />;
}
