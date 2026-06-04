import { OrderStatus } from "@/lib/interfaces/order";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_BG_COLORS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_BORDER_COLORS,
  ORDER_STATUS_ICON,
} from "@/lib/constants/orderStatusLabel";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const Icon = ORDER_STATUS_ICON[status];
  return (
    <div
      className={cn(
        "rounded-full inline-block px-3 border py-1",
        ORDER_STATUS_BORDER_COLORS[status],
        ORDER_STATUS_COLORS[status],
        ORDER_STATUS_BG_COLORS[status],
      )}
    >
      <div className="flex flex-row gap-x-2 text-sm items-center h-full">
        <Icon size={15} />
        {ORDER_STATUS_LABELS[status]}
      </div>
    </div>
  );
}
