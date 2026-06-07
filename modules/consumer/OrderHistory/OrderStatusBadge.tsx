import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/lib/interfaces/order";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";

const statusBadgeClass: Record<OrderStatus, string> = {
  [OrderStatus.DONE]: "bg-green-50 text-green-600 border-green-100",
  [OrderStatus.PAYING]: "bg-amber-50 text-amber-600 border-amber-100",
  [OrderStatus.SHIPPING]: "bg-blue-50 text-blue-600 border-blue-100",
  [OrderStatus.CANCELLED]: "bg-red-50 text-red-600 border-red-100",
  [OrderStatus.PREPARING]: "",
  [OrderStatus.PREPARED]: ""
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      className={`shadow-none px-2 py-0 border font-bold uppercase tracking-widest text-[9px] gap-1 ${statusBadgeClass[status]}`}
    >
      {status === OrderStatus.DONE && <CheckCircle size={10} />}
      {status === OrderStatus.PAYING && <Clock size={10} />}
      {status === OrderStatus.SHIPPING && <Truck size={10} />}
      {status === OrderStatus.CANCELLED && <XCircle size={10} />}
      {status}
    </Badge>
  );
}
