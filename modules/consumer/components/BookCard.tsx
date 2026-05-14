"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface BookCardProps {
  book: CollectionBookOverview;
  variant?: "normal" | "featured";
}

export function BookCard({ book, variant = "normal" }: BookCardProps) {
  return (
    <Link href={`/books/${book.book.slug}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className={`group flex flex-col bg-white rounded-2xl border border-border/30 overflow-hidden shadow-sm hover:shadow-md transition-all w-full`}
      >
        <div className="aspect-2/3 relative overflow-hidden bg-muted">
          <img
            src={
              book.book.image ??
              "https://placehold.co/400x600/e2e8f0/64748b?text=Book+Cover"
            }
            alt={book.book.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-electric-indigo"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-3 flex flex-col grow">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cool-slate mb-1">
            {book.book.categoryName}
          </span>
          <h3 className="text-lg font-bold leading-tight line-clamp-2 min-h-14">
            {book.book.name}
          </h3>
          <p className="text-sm text-cool-slate mt-1 mb-4 grow line-clamp-1 text-ellipsis">
            Tác giả {book.book.author ?? "Đang cập nhật"}
          </p>

          <Separator className="mb-4 bg-border/50" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-deep-charcoal">
              {formatPrice(book.book.salePrice ?? 0) ?? "Liên hệ"}
            </span>
            <Button
              variant="link"
              className="p-0 text-electric-indigo font-bold uppercase tracking-wider text-xs h-auto underline-offset-4 transition-all hover:underline"
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
