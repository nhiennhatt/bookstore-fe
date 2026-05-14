"use client";

import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDto } from "@/lib/interfaces/order";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { previewOrder as getPreviewOrder } from "@/services/orders/previewOrder";
import { CartDetail } from "./CartDetail";

export function Cart() {
  const { cart, removeFromCart, updateCartItemQuantity } = useCart();
  const [previewOrder, setPreviewOrder] = useState<OrderDto | null>(null);

  useEffect(() => {
    const fetchPreviewOrder = async () => {
      const response = await getPreviewOrder({
        variants: cart.map((item) => ({
          variantId: item.id,
          quantity: item.quantity,
        })),
      });
      if (response.error || !response.data) {
        setPreviewOrder(null);
        return;
      }
      setPreviewOrder(response.data);
    };
    fetchPreviewOrder();
  }, [cart]);

  return (
    <main className="grow py-12 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-cool-slate text-sm font-medium mb-4">
              <Link
                href="/"
                className="hover:text-deep-charcoal transition-colors"
              >
                Trang chủ
              </Link>
              <span className="text-cool-slate/30">/</span>
              <span className="text-deep-charcoal font-semibold">Giỏ hàng</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-deep-charcoal">
              Giỏ hàng của bạn
            </h1>
          </motion.div>
        </header>

        {!previewOrder || previewOrder.orderDetails.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-border/50 shadow-sm">
            <div className="h-20 w-20 bg-vapor-white rounded-full flex items-center justify-center mx-auto mb-6 text-cool-slate">
              <ShoppingCart size={40} />
            </div>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-cool-slate mb-8 max-w-md mx-auto leading-relaxed">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá những cuốn
              sách tuyệt vời của chúng tôi nhé!
            </p>
            <Button
              asChild
              className="rounded-xl bg-deep-charcoal hover:bg-deep-charcoal/90 text-white font-bold px-8 h-14 uppercase tracking-widest text-xs"
            >
              <Link href="/">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        ) : (
          <CartDetail
            previewOrder={previewOrder}
            removeFromCart={removeFromCart}
            updateCartItemQuantity={updateCartItemQuantity}
          />
        )}
      </div>
    </main>
  );
}
