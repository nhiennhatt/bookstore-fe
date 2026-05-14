"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function SuccessPayment({ orderId }: { orderId: string }) {
  return (
    <main className="grow pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md"
      >
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 shadow-sm border border-green-100">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-bold text-deep-charcoal mb-4 tracking-tighter">
          Đặt hàng thành công!
        </h1>
        <p className="text-cool-slate mb-10 leading-relaxed font-medium">
          Mã đơn hàng của bạn là{" "}
          <strong className="text-deep-charcoal">#{orderId}</strong>. Chúng tôi
          đã gửi email xác nhận chi tiết đơn hàng đến bạn.
        </p>
        <div className="flex flex-col gap-4">
          <Button
            asChild
            className="rounded-xl bg-deep-charcoal text-white font-bold h-14 uppercase tracking-widest text-xs"
          >
            <Link href={`/orders/${orderId}`}>Xem chi tiết đơn hàng</Link>
          </Button>
          <Link
            href="/profile"
            className="font-bold text-xs uppercase tracking-widest text-cool-slate"
          >
            Về trang cá nhân
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
