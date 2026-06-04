"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingCart, User } from "lucide-react";
import { UserAddress } from "@/lib/interfaces/address";
import Link from "next/link";
import { getAddresses } from "@/services/me";
import { OrderDto } from "@/lib/interfaces/order";
import { previewOrder as getPreviewOrder } from "@/services/orders/previewOrder";
import { useCart } from "@/hooks/useCart";
import { ShippingAddressSection } from "./ShippingAddressSection";
import { PaymentMethodSection } from "./PaymentMethodSection";
import { OrderSummary } from "./OrderSummary";
import { createOrder } from "@/services/orders";
import { useRouter } from "next/navigation";
import { useLoadingUser, useUser } from "@/hooks";
import { Button } from "@/components/ui/button";

export function CartPreview() {
  const [user] = useUser();
  const [loadingUser] = useLoadingUser();
  const { cart, clearCart } = useCart();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [previewOrder, setPreviewOrder] = useState<OrderDto | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAddress = async () => {
      const response = await getAddresses();
      if (response.error) return;
      setAddresses(response.data ?? []);
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchPreviewOrder = async () => {
      if (!cart || isCreatingOrder) return;
      const response = await getPreviewOrder({
        variants: cart.map((item) => ({
          variantId: item.id,
          quantity: item.quantity,
        })),
        addressId: selectedAddressId ?? undefined,
      });
      if (response.error || !response.data) return;
      setPreviewOrder(response.data);
    };
    fetchPreviewOrder();
  }, [cart, selectedAddressId]);

  const handleCreateOrder = async () => {
    if (!selectedAddressId || isCreatingOrder) return;
    setIsCreatingOrder(true);
    const response = await createOrder({
      variants: cart.map((item) => ({
        variantId: item.id,
        quantity: item.quantity,
      })),
      addressId: selectedAddressId,
    });
    if (response.error) {
      setIsCreatingOrder(false);
      return;
    }
    clearCart();
    router.replace(`/orders/${response.data.id}`);
  };

  if ((!cart || cart.length === 0) && !isCreatingOrder) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-border/50 shadow-sm">
        <div className="h-20 w-20 bg-vapor-white rounded-full flex items-center justify-center mx-auto mb-6 text-cool-slate">
          <ShoppingCart size={40} />
        </div>
        <h2 className="text-2xl font-bold text-deep-charcoal mb-4">
          Giỏ hàng trống
        </h2>
      </div>
    );
  }

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <main className="grow py-16 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-deep-charcoal mb-4 text-center">
                Vui lòng đăng nhập để tiếp tục
              </h1>
              <p className="text-lg text-cool-slate leading-relaxed">
                Bạn cần đăng nhập để tiếp tục thanh toán đơn hàng.
              </p>
              <Button
                asChild
                className="rounded-xl bg-deep-charcoal hover:bg-deep-charcoal/90 text-white font-bold px-8 h-14 uppercase tracking-widest text-xs my-6"
              >
                <Link href="/auth">Đăng nhập</Link>
              </Button>
            </motion.div>
          </header>
        </div>
      </main>
    );
  }

  return (
    <main className="grow py-16 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-cool-slate text-sm font-medium mb-4">
              <Link
                href="/cart"
                className="hover:text-deep-charcoal transition-colors flex items-center gap-1.5 group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Giỏ hàng
              </Link>
              <span className="text-cool-slate/30">/</span>
              <span className="text-deep-charcoal font-semibold">
                Thanh toán
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-deep-charcoal">
              Xác nhận đơn hàng
            </h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            <ShippingAddressSection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
            />
            <PaymentMethodSection />
          </div>

          <OrderSummary
            previewOrder={previewOrder}
            selectedAddressId={selectedAddressId}
            handleCreateOrder={handleCreateOrder}
            isCreatingOrder={isCreatingOrder}
          />
        </div>
      </div>
    </main>
  );
}
