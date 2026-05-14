"use client";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { BookCard } from "../../components/BookCard";
import { BookCollection } from "@/lib/interfaces/collection";
import { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import { useEffect, useState } from "react";
import { getCollectionBooks } from "@/services/collections";
import { Button } from "@/components/ui/button";

const COLLECTION_BOOKS_PAGE_SIZE = 8;

export function CollectionDetail({
  collection,
}: {
  collection: BookCollection;
}) {
  const [books, setBooks] = useState<CollectionBookOverview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      const res = await getCollectionBooks(collection.id, {
        cursor: 0,
        limit: COLLECTION_BOOKS_PAGE_SIZE,
      });
      setIsLoading(false);
      if (res.error) {
        setHasMore(false);
        setBooks([]);
        return;
      }
      setBooks(res.data);
      setHasMore(res.data.length === COLLECTION_BOOKS_PAGE_SIZE);
      setCursor(
        res.data.length > 0 ? res.data[res.data.length - 1].position : 0,
      );
    };
    void fetchBooks();
  }, []);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const res = await getCollectionBooks(collection.id, {
      cursor: cursor,
      limit: COLLECTION_BOOKS_PAGE_SIZE,
    });
    setIsLoading(false);
    if (res.error) {
      setHasMore(false);
      return;
    }
    setBooks([...books, ...res.data]);
    setHasMore(res.data.length === COLLECTION_BOOKS_PAGE_SIZE);
    setCursor(res.data.length > 0 ? res.data[res.data.length - 1].position : 0);
  };

  return (
    <main className="grow pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-cool-slate hover:text-deep-charcoal transition-colors mb-8 group"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Bộ sưu tập
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-deep-charcoal mb-6">
              {collection.name}
            </h1>
            {/* <p className="text-lg md:text-xl text-cool-slate leading-relaxed">
              {collection.description}
            </p> */}
          </motion.div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              className="basis-1/4 md:basis-1/5 py-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BookCard book={book} variant="normal" />
            </motion.div>
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center">
            <Button onClick={handleLoadMore}>Tải thêm</Button>
          </div>
        )}
      </div>
    </main>
  );
}
