"use client";

import { motion } from "motion/react";

export function CollectionsPageHeader() {
  return (
    <header className="mb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-deep-charcoal mb-6">
          Bộ sưu tập tuyển chọn
        </h1>
        <p className="text-lg md:text-xl text-cool-slate max-w-2xl mx-auto leading-relaxed">
          Khám phá các danh mục được tuyển soạn kỹ lưỡng theo chủ đề, tâm trạng
          và thể loại để tìm thấy cuốn sách tuyệt vời tiếp theo của bạn.
        </p>
      </motion.div>
    </header>
  );
}
