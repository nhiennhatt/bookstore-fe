import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function OrderHistoryHeader() {
  return (
    <header className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 text-cool-slate text-sm font-medium mb-4">
          <Link
            href="/profile"
            className="hover:text-deep-charcoal transition-colors flex items-center gap-1.5 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Hồ sơ
          </Link>
          <span className="text-cool-slate/30">/</span>
          <span className="text-deep-charcoal font-semibold">
            Lịch sử đơn hàng
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-deep-charcoal mb-4">
          Đơn hàng của tôi
        </h1>
        <p className="text-lg text-cool-slate leading-relaxed">
          Theo dõi và quản lý các đơn hàng bạn đã thực hiện tại Lumina.
        </p>
      </motion.div>
    </header>
  );
}
