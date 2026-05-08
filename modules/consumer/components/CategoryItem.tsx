"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/interfaces/category";

interface CategoryItemProps {
  category: Category;
  large?: boolean;
}

export function CategoryItem({ category, large = false }: CategoryItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-border/50 h-full ${large ? "md:col-span-2 lg:col-span-2" : ""}`}
    >
      <img
        src={
          category.thumbImg ||
          "https://placehold.co/640x480/e2e8f0/64748b?text=Category"
        }
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-deep-charcoal/80 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 flex flex-col gap-1">
        {category.featured && (
          <Badge className="w-fit bg-white/20 backdrop-blur-md text-white border-none text-[10px] uppercase tracking-wide px-2 py-0.5">
            Nổi bật
          </Badge>
        )}
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {category.name}
        </h3>
      </div>
    </motion.div>
  );
}
