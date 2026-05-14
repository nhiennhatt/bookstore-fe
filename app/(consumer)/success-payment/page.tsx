import { SuccessPayment } from "@/modules/consumer/SuccessPayment";

export default async function SuccessPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) {
  const { orderId } = await searchParams;
  return <SuccessPayment orderId={orderId} />;
}
