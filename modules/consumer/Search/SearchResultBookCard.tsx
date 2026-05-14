"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookOverview } from "@/lib/interfaces/book";

type SearchResultBookCardProps = {
  book: BookOverview;
  index: number;
};

export function SearchResultBookCard({
  book,
  index,
}: SearchResultBookCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/books/${book.slug}`} className="group block">
        <div className="relative aspect-3/4 mb-4 overflow-hidden rounded-2xl bg-vapor-white shadow-sm border border-border/10">
          <img
            src={book.image}
            alt={book.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
            <span className="bg-white text-black text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
              Xem chi tiết <ArrowRight size={12} />
            </span>
          </div>
        </div>
        <h3 className="font-bold text-deep-charcoal mb-1 line-clamp-1 group-hover:text-electric-indigo transition-colors">
          {book.name}
        </h3>
        <p className="text-xs text-cool-slate font-medium mb-2">
          {book.author}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-electric-indigo">
            {book.salePrice}
          </span>
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-bold tracking-widest px-2 py-0 border-border/30 opacity-60"
          >
            {book.categoryName}
          </Badge>
        </div>
      </Link>
    </motion.div>
  );
}
