import { Separator } from "@/components/ui/separator";
import { OrderDto } from "@/lib/interfaces/order";
import { formatPrice } from "@/lib/utils";

function SummaryRow({
  label,
  value,
  valueClassName = "font-semibold text-neutral-900 tabular-nums",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

export function Summary({ order }: { order: OrderDto }) {
  const hasOrderDiscount = order.orderDiscount > 0;
  const hasShippingDiscount = order.shippingDiscount > 0;

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 px-4 py-6 sticky top-6 space-y-5">
      <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">
        Tóm tắt đơn hàng
      </h2>

      <div className="space-y-3">
        <SummaryRow
          label="Tạm tính"
          value={formatPrice(order.subtotalPrice)}
        />
        <SummaryRow
          label="Phí giao hàng"
          value={formatPrice(order.shippingFee)}
        />
        {hasOrderDiscount && (
          <SummaryRow
            label="Giảm giá đơn hàng"
            value={`-${formatPrice(order.orderDiscount)}`}
            valueClassName="font-semibold text-red-600 tabular-nums"
          />
        )}
        {hasShippingDiscount && (
          <SummaryRow
            label="Giảm giá phí giao hàng"
            value={`-${formatPrice(order.shippingDiscount)}`}
            valueClassName="font-semibold text-green-600 tabular-nums"
          />
        )}
      </div>

      <Separator className="bg-neutral-100" />

      <div className="flex items-baseline justify-between gap-4">
        <span className="text-base font-semibold text-neutral-900">
          Tổng cộng
        </span>
        <span className="text-2xl font-bold text-neutral-900 tabular-nums tracking-tight">
          {formatPrice(order.grandTotal)}
        </span>
      </div>
    </div>
  );
}
