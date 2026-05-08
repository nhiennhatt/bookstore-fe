"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import { ScrollBar } from "@/components/ui/scroll-area";
import { BookStatus } from "@/lib/interfaces/book";
import type { BookCollection } from "@/lib/interfaces/collection";
import type { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import { BookVariantStatus } from "@/lib/interfaces/bookVariant";
import { getCollectionBooks } from "@/services/collections/getCollectionBooks";
import { BookCard } from "./BookCard";

const SCROLL_STEP = 350;

export function CollectionItem({
  isFeatured = false,
  collection,
}: {
  isFeatured?: boolean;
  collection: BookCollection;
}) {
  const areaScrollRef = useRef<HTMLDivElement>(null);
  const [books, setBooks] = useState<CollectionBookOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCollectionBooks = async () => {
      setIsLoading(true);
      try {
        const booksResponse = await getCollectionBooks(collection.id, {
          limit: 10,
          bookStatus: BookStatus.ACTIVE,
          bookVariantStatus: BookVariantStatus.ACTIVE,
          isStockValid: true,
        });
        if (!isMounted) return;
        if (booksResponse.error) {
          console.error(booksResponse.error);
          setBooks([]);
          return;
        }
        const rows = booksResponse.data;
        setBooks(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setBooks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCollectionBooks();

    return () => {
      isMounted = false;
    };
  }, [collection.id]);

  const handleScrollToRight = () => {
    if (areaScrollRef.current) {
      areaScrollRef.current.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });
    }
  };

  const handleScrollToLeft = () => {
    if (areaScrollRef.current) {
      areaScrollRef.current.scrollBy({
        left: -SCROLL_STEP,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div
        className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold">{collection.name}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-border/50 bg-white shadow-sm hover:border-electric-indigo hover:text-electric-indigo transition-colors"
            onClick={handleScrollToLeft}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-border/50 bg-white shadow-sm hover:border-electric-indigo hover:text-electric-indigo transition-colors"
            onClick={handleScrollToRight}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <p className="mb-4 text-sm text-cool-slate">Đang tải sách trong bộ sưu tập...</p>
        )}
        <ScrollAreaPrimitive.Root className="w-full whitespace-nowrap pb-6">
          <ScrollAreaPrimitive.Viewport
            ref={areaScrollRef}
            className="h-full w-full rounded-[inherit]"
          >
            <div className="flex w-max space-x-6 py-2.5 px-2.5">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  variant={isFeatured ? "featured" : "normal"}
                />
              ))}
              {books.length > 0 && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center justify-center min-w-[280px] w-[280px] bg-transparent border-2 border-dashed border-cool-slate/30 rounded-2xl cursor-pointer hover:border-electric-indigo hover:bg-electric-indigo/5 transition-all group"
                >
                  <ArrowRight className="h-10 w-10 text-cool-slate mb-4 group-hover:text-electric-indigo group-hover:translate-x-2 transition-all" />
                  <span className="text-xs font-bold uppercase tracking-widest text-deep-charcoal">
                    Xem tất cả gợi ý
                  </span>
                </motion.div>
              )}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollAreaPrimitive.Viewport>
        </ScrollAreaPrimitive.Root>
        {books.length === 0 && (
          <p className="text-sm text-cool-slate">
            Chưa có sách trong bộ sưu tập này.
          </p>
        )}
      </div>
    </div>
  );
}
