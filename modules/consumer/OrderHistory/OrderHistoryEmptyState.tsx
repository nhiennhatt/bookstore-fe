import { Package } from "lucide-react";
import Link from "next/link";

export function OrderHistoryEmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-border/50 shadow-sm">
      <div className="h-20 w-20 bg-vapor-white rounded-full flex items-center justify-center mx-auto mb-6 text-cool-slate">
        <Package size={40} />
      </div>
      <h2 className="text-2xl font-bold text-deep-charcoal mb-4">
        Chưa có đơn hàng nào
      </h2>
      <p className="text-cool-slate mb-8 max-w-md mx-auto leading-relaxed">
        Bạn chưa thực hiện đơn đặt hàng nào. Hãy khám phá kho sách của chúng tôi
        nhé!
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-xl bg-deep-charcoal text-white font-bold h-14 px-8 uppercase tracking-widest text-xs"
      >
        Khám phá ngay
      </Link>
    </div>
  );
}
