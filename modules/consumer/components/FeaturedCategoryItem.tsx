"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BookCard } from "./BookCard";
import type { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import type { Category } from "@/lib/interfaces/category";
import type { BookOverview } from "@/lib/interfaces/book";
import { Button } from "@/components/ui/button";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { getBooks } from "@/services/books/getBooks";

const SCROLL_STEP = 350;
const BOOKS_PER_CATEGORY_LIMIT = 10;

export function FeaturedCategoryItem({
  category,
}: {
  category: Category;
}) {
  const areaScrollRef = useRef<HTMLDivElement>(null);
  const [books, setBooks] = useState<BookOverview[]>([]);

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
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-2xl md:text-3xl font-bold">{category.name}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-11 w-11 border-border/50 bg-white shadow-sm hover:border-electric-indigo hover:text-electric-indigo transition-colors"
            onClick={handleScrollToLeft}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-11 w-11 border-border/50 bg-white shadow-sm hover:border-electric-indigo hover:text-electric-indigo transition-colors"
            onClick={handleScrollToRight}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollAreaPrimitive.Root className="w-full whitespace-nowrap pb-4">
        <ScrollAreaPrimitive.Viewport
          ref={areaScrollRef}
          className="h-full w-full rounded-[inherit]"
        >
          <div className="flex w-max space-x-6 py-2.5 px-2.5">
            {books.map((book) => {
              const adaptedBook: CollectionBookOverview = {
                id: book.id,
                collectionId: category.id,
                position: 0,
                collectionName: category.name,
                book,
              };
              return <BookCard key={book.id} book={adaptedBook} />;
            })}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollAreaPrimitive.Viewport>
      </ScrollAreaPrimitive.Root>

      {books.length === 0 && (
        <p className="text-sm text-cool-slate text-center">
          Chưa có sách trong danh mục này.
        </p>
      )}
    </div>
  );
}
