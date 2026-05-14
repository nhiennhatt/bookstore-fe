"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookCard } from "../components/BookCard";
import { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import { BookCollection } from "@/lib/interfaces/collection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CollectionBooksCarouselSectionProps = {
  collection: BookCollection;
  books: CollectionBookOverview[];
  collectionIndex: number;
};

export function CollectionBooksCarouselSection({
  collection,
  books,
  collectionIndex,
}: CollectionBooksCarouselSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: collectionIndex * 0.1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-cool-slate/20 pb-6 gap-4">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-deep-charcoal mb-2">
            {collection.name}
          </h2>
        </div>
        <Link
          href={`/collections/${collection.id}`}
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
                    delay: collectionIndex * 0.1 + index * 0.05,
                  }}
                >
                  <BookCard book={book} variant="normal" />
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
          Chưa có sách trong bộ sưu tập này.
        </p>
      )}
    </motion.section>
  );
}
