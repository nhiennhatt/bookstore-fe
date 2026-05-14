"use client";

import { motion } from "motion/react";

export function CategoryPageHeader() {
  return (
    <header className="mb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-deep-charcoal mb-6">
          Danh mục sách
        </h1>
        <p className="text-lg md:text-xl text-cool-slate max-w-2xl mx-auto leading-relaxed">
          Duyệt theo từng thể loại để nhanh chóng tìm thấy những cuốn sách phù
          hợp với sở thích và nhu cầu đọc của bạn.
        </p>
      </motion.div>
    </header>
  );
}
