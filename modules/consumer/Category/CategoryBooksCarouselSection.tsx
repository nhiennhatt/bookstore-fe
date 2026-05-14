"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookCard } from "../components/BookCard";
import type { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import type { Category } from "@/lib/interfaces/category";
import type { BookOverview } from "@/lib/interfaces/book";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CategoryBooksCarouselSectionProps = {
  category: Category;
  books: BookOverview[];
  categoryIndex: number;
};

function toCardBook(category: Category, book: BookOverview): CollectionBookOverview {
  return {
    id: book.id,
    collectionId: category.id,
    position: 0,
    collectionName: category.name,
    book,
  };
}

export function CategoryBooksCarouselSection({
  category,
  books,
  categoryIndex,
}: CategoryBooksCarouselSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-cool-slate/20 pb-6 gap-4">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-deep-charcoal mb-2">
            {category.name}
          </h2>
        </div>
        <Link
          href={`/search?category=${encodeURIComponent(category.slug)}`}
          className="group flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-electric-indigo hover:text-deep-charcoal transition-colors shrink-0"
        >
          Xem tất cả
          <span className="w-6 h-px bg-electric-indigo group-hover:bg-deep-charcoal transition-all" />
        </Link>
      </div>

      {books.length > 0 && (
        <Carousel orientation="horizontal">
          <CarouselContent>
            {books.map((book, index) => (
              <CarouselItem
                key={book.id}
                className="basis-1/4 md:basis-1/5 py-3"
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: categoryIndex * 0.1 + index * 0.05,
                  }}
                >
                  <BookCard book={toCardBook(category, book)} variant="normal" />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious size="icon-lg" />
          <CarouselNext size="icon-lg" />
        </Carousel>
      )}

      {books.length === 0 && (
        <p className="text-sm text-cool-slate">
          Chưa có sách trong danh mục này.
        </p>
      )}
    </motion.section>
  );
}
