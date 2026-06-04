import { OrderDetailDto } from "@/lib/interfaces/order";
import { formatPrice } from "@/lib/utils";

export function VariantCard({ variant }: { variant: OrderDetailDto }) {
  const hasDiscount = variant.originUnitPrice > variant.unitPrice;

  return (
    <div
      key={variant.id}
      className="bg-white border border-neutral-200 rounded-2xl px-4 py-6 flex flex-row items-stretch gap-x-4"
    >
      <div className="h-80 w-auto aspect-3/4 overflow-hidden rounded-xl gap-y-2">
        <img
          className="w-full h-full object-center object-cover"
          alt={`${variant.bookName}-${variant.variantName}`}
          src={variant.image || ""}
        />
      </div>
      <div className="flex flex-1 flex-col min-w-0 py-1">
        <header className="space-y-0.5">
          <h3 className="font-semibold text-neutral-900 text-2xl leading-snug tracking-tight line-clamp-2">
            {variant.bookName}
          </h3>
          <p className="text-xl text-neutral-500">{variant.variantName}</p>
        </header>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-2.5 py-1 text-md text-neutral-600">
            <span className="text-neutral-400">SL</span>
            <span className="font-medium tabular-nums">{variant.quantity}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-2.5 py-1 text-md text-neutral-600 font-mono">
            <span className="text-neutral-400 font-sans">ISBN</span>
            {variant.isbn}
          </span>
        </div>

        <footer className="mt-auto pt-5 border-t border-neutral-100 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
              Đơn giá
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-neutral-900 tabular-nums">
                {formatPrice(variant.unitPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-neutral-400 line-through tabular-nums">
                  {formatPrice(variant.originUnitPrice)}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
              Thành tiền
            </p>
            <p className="text-lg font-semibold text-neutral-900 tabular-nums">
              {formatPrice(variant.totalPrice)}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
