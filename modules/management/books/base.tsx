"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import {
  AdminBookCard,
  AdminBookCardSkeleton,
} from "@/components/commons/AdminBookCard";
import { CategorySearchableSelect } from "@/components/commons/CategorySearchableSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BOOKS_PAGE_SIZE } from "@/lib/constants/booksPagination";
import type { Book } from "@/lib/interfaces/book";
import { getBooks } from "@/services/books";
import { BookCreateDialog } from "./BookCreateDialog";

const ALL_CATEGORIES_VALUE = "__all__";

export function BooksBase() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const loadingBooksRef = useRef(false);

  const categoryIdForRequest = categoryFilter || null;

  const loadBooks = useCallback(
    async (options?: { reset?: boolean }) => {
      const shouldReset = !!options?.reset;
      if (loadingBooksRef.current) return;
      if (!shouldReset && !hasMoreRef.current) return;

      loadingBooksRef.current = true;
      setIsLoadingMore(true);
      try {
        const cursorToUse = shouldReset ? null : nextCursorRef.current;
        const items = await getBooks({
          categoryId: categoryIdForRequest,
          cursor: cursorToUse,
        });

        const pageFull = items.length === BOOKS_PAGE_SIZE;
        const tailId =
          items.length > 0 ? items[items.length - 1]?.id ?? null : null;
        hasMoreRef.current = pageFull && Boolean(tailId);
        nextCursorRef.current = pageFull && tailId ? tailId : null;

        setBooks((prev) => {
          if (shouldReset) return items;
          const seen = new Set(prev.map((b) => b.id));
          const appended = items.filter((b) => !seen.has(b.id));
          return [...prev, ...appended];
        });
        setHasLoadedOnce(true);
      } catch (error) {
        console.error(error);
      } finally {
        loadingBooksRef.current = false;
        setIsLoadingMore(false);
      }
    },
    [categoryIdForRequest],
  );

  useEffect(() => {
    hasMoreRef.current = true;
    nextCursorRef.current = null;
    void loadBooks({ reset: true });
  }, [loadBooks]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        void loadBooks();
      },
      {
        root: null,
        rootMargin: "320px 0px 320px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadBooks]);

  const showInitialSkeleton = !hasLoadedOnce && isLoadingMore;

  const handleBookCreated = (book: Book) => {
    setBooks((prev) => [book, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sách</h1>
          <p className="text-sm text-muted-foreground">
            Danh sách sách trong kho quản trị.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
          <div className="flex w-full flex-col gap-1.5 sm:w-64">
            <Label
              htmlFor="books-filter-category"
              className="text-xs font-medium text-muted-foreground"
            >
              Lọc theo danh mục
            </Label>
            <CategorySearchableSelect
              value={categoryFilter || ALL_CATEGORIES_VALUE}
              onValueChange={(v) =>
                setCategoryFilter(v === ALL_CATEGORIES_VALUE ? "" : v)
              }
              sentinelOption={{
                value: ALL_CATEGORIES_VALUE,
                label: "Tất cả danh mục",
              }}
              triggerId="books-filter-category"
              triggerClassName="w-full"
              placeholder="Chọn danh mục"
            />
          </div>

          <Button
            className="gap-2 sm:min-w-28"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="size-4" />
            Thêm sách
          </Button>
        </div>
      </div>

      {showInitialSkeleton ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 @min-3xl:grid-cols-7">
          {Array.from({ length: 8 }).map((_, i) => (
            <AdminBookCardSkeleton key={i} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          Chưa có sách nào{categoryFilter ? " trong danh mục này" : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 @min-3xl:grid-cols-7">
          {books.map((book) => (
            <AdminBookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      <div ref={loadMoreRef} aria-hidden className="h-1 w-full shrink-0" />

      {hasLoadedOnce && isLoadingMore && books.length > 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Đang tải thêm…
        </p>
      ) : null}

      <BookCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={handleBookCreated}
      />
    </div>
  );
}
