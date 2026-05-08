"use client";

import { Search } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px] font-bold text-deep-charcoal bg-white border-border shadow-sm"
          >
            Tuyển chọn với tinh thần khác biệt
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
            Khám phá niềm đam mê tiếp theo của bạn.
          </h1>
          <p className="text-lg md:text-xl text-cool-slate max-w-2xl mx-auto leading-relaxed">
            Tuyển tập tiểu thuyết đương đại, tác phẩm kinh điển và sách phi hư
            cấu đầy sâu sắc. Dành riêng cho những độc giả tinh tế.
          </p>

          <div className="mt-8 w-full max-w-xl group relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-cool-slate group-focus-within:text-electric-indigo transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Tìm kiếm tựa sách, tác giả hoặc mã ISBN..."
              className="h-16 pl-14 pr-32 rounded-full border-border bg-white text-base shadow-sm focus-visible:ring-1 focus-visible:ring-electric-indigo/20 transition-all"
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-[52px] rounded-full px-8 bg-primary hover:bg-primary/90 text-sm font-bold uppercase tracking-widest transition-transform active:scale-95">
              Tìm kiếm
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-electric-indigo/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-electric-indigo/5 rounded-full blur-[100px] -z-10" />
    </section>
  );
}
