"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BookStatus } from "@/lib/interfaces/book";
import type { BookCollection } from "@/lib/interfaces/collection";
import type { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import { BookVariantStatus } from "@/lib/interfaces/bookVariant";
import { getCollectionBooks } from "@/services/collections/getCollectionBooks";
import { BookCard } from "./BookCard";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";

export function CollectionItem({
  isFeatured = false,
  collection,
}: {
  isFeatured?: boolean;
  collection: BookCollection;
}) {
  const [books, setBooks] = useState<CollectionBookOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [canScrollNext, setCanScrollNext] = useState(true);

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

  const next = useCallback(() => {
    carouselApi?.scrollNext();
  }, [carouselApi]);

  const prev = useCallback(() => {
    carouselApi?.scrollPrev();
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || isLoading) return;
    const calculateCanScroll = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    calculateCanScroll();

    const addEventListeners = () => {
      carouselApi.on("scroll", calculateCanScroll);
    };
    addEventListeners();
    return () => {
      carouselApi.off("scroll", calculateCanScroll);
    };
  }, [carouselApi, isLoading]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">{collection.name}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!canScrollPrev}
            size="icon"
            className="rounded-full h-12 w-12 border-border/50 bg-white shadow-sm hover:border-electric-indigo hover:text-electric-indigo transition-colors"
            onClick={prev}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            disabled={!canScrollNext}
            size="icon"
            className="rounded-full h-12 w-12 border-border/50 bg-white shadow-sm hover:border-electric-indigo hover:text-electric-indigo transition-colors"
            onClick={next}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <p className="mb-4 text-sm text-cool-slate">
            Đang tải sách trong bộ sưu tập...
          </p>
        )}
        <Carousel
          className="w-full whitespace-nowrap pb-6"
          setApi={setCarouselApi}
        >
          <CarouselContent>
            {books.map((book) => (
              <CarouselItem
                key={book.id}
                className="basis-1/4 md:basis-1/5 py-3"
              >
                <BookCard
                  book={book}
                  variant={isFeatured ? "featured" : "normal"}
                />
              </CarouselItem>
            ))}
            {books.length > 0 && (
              <CarouselItem className="basis-1/4 md:basis-1/5 py-3">
                <Link href={`/collections/${collection.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="h-full flex flex-col items-center justify-center min-w-[280px] w-[280px] bg-transparent border-2 border-dashed border-cool-slate/30 rounded-2xl cursor-pointer hover:border-electric-indigo hover:bg-electric-indigo/5 transition-all group"
                  >
                    <ArrowRight className="h-10 w-10 text-cool-slate mb-4 group-hover:text-electric-indigo group-hover:translate-x-2 transition-all" />
                    <span className="text-xs font-bold uppercase tracking-widest text-deep-charcoal">
                      Xem tất cả gợi ý
                    </span>
                  </motion.div>
                </Link>
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
        {books.length === 0 && (
          <p className="text-sm text-cool-slate">
            Chưa có sách trong bộ sưu tập này.
          </p>
        )}
      </div>
    </div>
  );
}
