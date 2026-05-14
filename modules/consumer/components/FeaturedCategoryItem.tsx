"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BookCard } from "./BookCard";
import type { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import type { Category } from "@/lib/interfaces/category";
import type { BookOverview } from "@/lib/interfaces/book";
import { Button } from "@/components/ui/button";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { getBooks } from "@/services/books/getBooks";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const SCROLL_STEP = 350;
const BOOKS_PER_CATEGORY_LIMIT = 10;

export function FeaturedCategoryItem({ category }: { category: Category }) {
  const [books, setBooks] = useState<BookOverview[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (!carouselApi || !books || books.length === 0) return;
    const calculateCanScroll = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    calculateCanScroll();
    carouselApi.on("scroll", calculateCanScroll);
    return () => {
      carouselApi.off("scroll", calculateCanScroll);
    };
  }, [carouselApi, books]);

  const next = useCallback(() => {
    carouselApi?.scrollNext();
  }, [carouselApi]);

  const prev = useCallback(() => {
    carouselApi?.scrollPrev();
  }, [carouselApi]);

  useEffect(() => {
    let mounted = true;

    const fetchCategoryBooks = async () => {
      try {
        const booksRes = await getBooks({
          categoryId: category.id,
          limit: BOOKS_PER_CATEGORY_LIMIT,
        });
        console.log(booksRes.data);
        if (mounted) {
          if (booksRes.error || !booksRes.data) {
            setBooks([]);
          } else {
            setBooks(booksRes.data);
          }
        }
      } catch (error) {
        console.error("FeaturedCategoryItem:", error);
        if (mounted) {
          setBooks([]);
        }
      }
    };

    void fetchCategoryBooks();
    return () => {
      mounted = false;
    };
  }, [category.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-2xl md:text-3xl font-bold">{category.name}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!canScrollPrev}
            className="rounded-full h-11 w-11 border-border/50 bg-white shadow-sm hover:border-electric-indigo hover:text-electric-indigo transition-colors"
            onClick={prev}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!canScrollNext}
            className="rounded-full h-11 w-11 border-border/50 bg-white shadow-sm hover:border-electric-indigo hover:text-electric-indigo transition-colors"
            onClick={next}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Carousel
        className="w-full whitespace-nowrap pb-4"
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {books.map((book) => {
            const adaptedBook: CollectionBookOverview = {
              id: book.id,
              collectionId: category.id,
              position: 0,
              collectionName: category.name,
              book,
            };
            return (
              <CarouselItem
                key={book.id}
                className="basis-1/4 md:basis-1/5 py-3"
              >
                <BookCard book={adaptedBook} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {books.length === 0 && (
        <p className="text-sm text-cool-slate text-center">
          Chưa có sách trong danh mục này.
        </p>
      )}
    </div>
  );
}
