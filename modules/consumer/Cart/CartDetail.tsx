import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderDto } from "@/lib/interfaces/order";
import {
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export function CartDetail({
  previewOrder,
  removeFromCart,
  updateCartItemQuantity,
}: {
  previewOrder: OrderDto;
  removeFromCart: (variantId: string) => void;
  updateCartItemQuantity: (variantId: string, quantity: number) => void;
}) {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left side: Cart Items */}
      <div className="lg:col-span-8 space-y-6">
        {previewOrder.orderDetails.map((item) => (
          <motion.div
            key={item.variantId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl border border-border/50 p-6 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <div className="w-full sm:w-28 aspect-3/4 rounded-xl overflow-hidden bg-muted shrink-0">
              <img
                src={item.image}
                alt={item.bookName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Link
                    href={`/books/${item.bookSlug}`}
                    className="hover:text-electric-indigo transition-colors"
                  >
                    <h3 className="text-xl font-bold text-deep-charcoal line-clamp-1">
                      {item.bookName}
                    </h3>
                  </Link>
                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-cool-slate hover:text-red-500 transition-colors p-2 -mr-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-sm text-cool-slate font-medium mb-4">
                  Phiên bản:{" "}
                  <span className="text-deep-charcoal">{item.variantName}</span>
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center border border-border rounded-xl h-10 overflow-hidden bg-vapor-white shadow-inner">
                  <button
                    onClick={() =>
                      updateCartItemQuantity(item.variantId, item.quantity - 1)
                    }
                    className="w-10 h-full flex items-center justify-center hover:bg-white transition-colors text-lg text-cool-slate"
                  >
                    <Minus size={14} />
                  </button>
                  <div className="w-8 h-full flex items-center justify-center font-bold text-sm">
                    {item.quantity}
                  </div>
                  <button
                    onClick={() =>
                      updateCartItemQuantity(item.variantId, item.quantity + 1)
                    }
                    className="w-10 h-full flex items-center justify-center hover:bg-white transition-colors text-lg text-cool-slate"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right">
                  <span className="block text-sm text-cool-slate line-through opacity-50 mb-0.5">
                    {formatPrice(item.originUnitPrice)}
                  </span>
                  <span className="text-lg font-bold text-deep-charcoal tracking-tight">
                    {formatPrice(item.unitPrice)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-cool-slate hover:text-electric-indigo transition-all group pt-4"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Tiếp tục mua sắm
        </Link>
      </div>

      {/* Right side: Summary */}
      <div className="lg:col-span-4">
        <div className="bg-white rounded-3xl border border-border/50 p-8 shadow-sm sticky top-32 space-y-8">
          <h3 className="text-2xl font-bold text-deep-charcoal">
            Tổng đơn hàng
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-cool-slate font-medium">Tạm tính</span>
              <span className="text-deep-charcoal font-bold">
                {formatPrice(previewOrder.subtotalPrice)}
              </span>
            </div>
            {previewOrder.orderDiscount && previewOrder.orderDiscount > 0 ? (
              <div className="flex justify-between text-sm text-green-600">
                <span className="font-medium">Giảm giá đơn hàng</span>
                <span className="font-bold">
                  -{formatPrice(previewOrder.orderDiscount)}
                </span>
              </div>
            ) : null}
          </div>

          <Separator className="bg-border/50" />

          <div className="flex justify-between items-baseline">
            <span className="text-lg font-bold text-deep-charcoal">
              Tổng cộng
            </span>
            <span className="text-3xl font-bold text-electric-indigo tracking-tight">
              {formatPrice(previewOrder.grandTotal)}
            </span>
          </div>

          <Button asChild className="w-full h-14 rounded-xl bg-deep-charcoal hover:bg-deep-charcoal/90 text-white font-bold uppercase tracking-widest text-xs gap-3 shadow-lg shadow-deep-charcoal/10">
            <Link href="/cart/preview">
              Thanh toán ngay
              <ChevronRight size={18} />
            </Link>
          </Button>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-xs text-cool-slate">
              <ShieldCheck size={16} className="text-green-500" />
              <span>Thanh toán an toàn 100%</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-cool-slate">
              <Truck size={16} className="text-electric-indigo" />
              <span>Giao hàng nhanh toàn quốc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
