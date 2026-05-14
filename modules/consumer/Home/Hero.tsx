"use client";

import { Search } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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
            Tuyển chọn dành cho bạn
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
            Tiếng Vọng Của Tâm Trí, Gói Gọn Trong Ngôn Từ.
          </h1>
          <p className="text-lg md:text-xl text-cool-slate max-w-2xl mx-auto leading-relaxed">
            Khám phá những cuốn sách nói thay những suy nghĩ mà bạn chưa thể tìm
            ra từ ngữ để diễn đạt.
          </p>

          <form
            className="max-w-xl w-full"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?query=${searchQuery}`);
            }}
          >
            <InputGroup className="w-full h-16 rounded-full">
              <InputGroupAddon>
                <InputGroupButton variant="ghost">
                  <Search className="size-8" />
                </InputGroupButton>
              </InputGroupAddon>
              <InputGroupInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-full"
                placeholder="Tìm kiếm tựa sách, tác giả hoặc mã ISBN..."
              />
              <InputGroupAddon align="inline-end" className="h-full">
                <InputGroupButton
                  className="rounded-full h-full px-8"
                  variant="secondary"
                  type="submit"
                >
                  Tìm kiếm
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-electric-indigo/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-electric-indigo/5 rounded-full blur-[100px] -z-10" />
    </section>
  );
}
