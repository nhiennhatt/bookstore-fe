"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import {
  AdminBookCard,
  AdminBookCardSkeleton,
} from "@/components/commons/AdminBookCard";
import { CategorySearchableSelect } from "@/components/commons/CategorySearchableSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookStatus } from "@/lib/interfaces/book";
import type { Book, BookOverview } from "@/lib/interfaces/book";
import { BookVariantStatus } from "@/lib/interfaces/bookVariant";
import { BOOKS_PAGE_SIZE } from "@/lib/constants/booksPagination";
import { getBooks } from "@/services/books";
import { BookCreateDialog } from "./BookCreateDialog";

const ALL_CATEGORIES_VALUE = "__all__";
const BOOL_ALL_VALUE = "__all__";
const BOOL_TRUE_VALUE = "true";
const BOOL_FALSE_VALUE = "false";

const SEARCH_DEBOUNCE_MS = 300;
const BOOK_GRID_CLASS =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 @min-3xl:grid-cols-7";

const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  [BookStatus.ACTIVE]: "Đang bán",
  [BookStatus.INACTIVE]: "Ngưng hiển thị",
  [BookStatus.COMING_SOON]: "Sắp có",
  [BookStatus.DISCONTINUED]: "Ngừng phân phối",
};

const BOOK_STATUS_OPTIONS = Object.values(BookStatus) as BookStatus[];

const VARIANT_STATUS_LABELS: Record<BookVariantStatus, string> = {
  [BookVariantStatus.ACTIVE]: "Đang bán",
  [BookVariantStatus.INACTIVE]: "Ngưng",
};

const VARIANT_STATUS_OPTIONS = Object.values(
  BookVariantStatus,
) as BookVariantStatus[];

/**
 * Coi trang là “đầy” khi số bản ghi ≥ limit đã yêu cầu — backend có thể trả về
 * đúng limit hoặc default lớn hơn; dùng === limit sẽ tắt “tải thêm” quá sớm.
 */
function resolveNextPageState(items: BookOverview[], pageSize: number) {
  const tailId =
    items.length > 0 ? items[items.length - 1]?.id ?? null : null;
  const hasNextPage = items.length >= pageSize && Boolean(tailId);

  return {
    hasNextPage,
    nextCursor: hasNextPage ? tailId : null,
  };
}

function mergeBooks(prev: BookOverview[], next: BookOverview[]) {
  const seen = new Set(prev.map((book) => book.id));
  const appended = next.filter((book) => !seen.has(book.id));
  return [...prev, ...appended];
}

export function BooksBase() {
  const [books, setBooks] = useState<BookOverview[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [keywordDraft, setKeywordDraft] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [bookStatusFilter, setBookStatusFilter] = useState<BookStatus | null>(
    null,
  );
  const [variantStatusFilter, setVariantStatusFilter] = useState<
    BookVariantStatus | null
  >(null);
  const [isStockValidFilter, setIsStockValidFilter] = useState<boolean | null>(
    null,
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const loadingBooksRef = useRef(false);

  const categoryIdForRequest = categoryFilter || null;

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedKeyword(keywordDraft.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(t);
  }, [keywordDraft]);

  const loadBooks = useCallback(
    async (options?: { reset?: boolean }) => {
      const shouldReset = !!options?.reset;
      if (loadingBooksRef.current) return;
      if (!shouldReset && !hasMoreRef.current) return;

      if (shouldReset) {
        // Khi thay filter, xoá danh sách hiện tại để UX nhất quán.
        setHasLoadedOnce(false);
        setBooks([]);
      }

      loadingBooksRef.current = true;
      setIsLoadingMore(true);
      try {
        const cursorToUse = shouldReset ? null : nextCursorRef.current;
        const booksRes = await getBooks({
          categoryId: categoryIdForRequest,
          cursor: cursorToUse,
          limit: BOOKS_PAGE_SIZE,
          keyword: debouncedKeyword || undefined,
          bookStatus: bookStatusFilter ?? undefined,
          variantStatus: variantStatusFilter ?? undefined,
          isStockValid: isStockValidFilter ?? undefined,
        });

        if (booksRes.error) {
          console.error(booksRes.error);
          return;
        }
        const raw = booksRes.data;
        const items = Array.isArray(raw) ? raw : [];

        const nextPageState = resolveNextPageState(items, BOOKS_PAGE_SIZE);
        hasMoreRef.current = nextPageState.hasNextPage;
        nextCursorRef.current = nextPageState.nextCursor;

        setBooks((prev) => {
          if (shouldReset) return items;
          return mergeBooks(prev, items);
        });
        setHasLoadedOnce(true);
      } catch (error) {
        console.error(error);
      } finally {
        loadingBooksRef.current = false;
        setIsLoadingMore(false);
      }
    },
    [
      bookStatusFilter,
      categoryIdForRequest,
      debouncedKeyword,
      isStockValidFilter,
      variantStatusFilter,
    ],
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

  useEffect(() => {
    if (isLoadingMore) return;
    if (!hasMoreRef.current) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const isNearViewportBottom = rect.top <= window.innerHeight + 320;
    if (!isNearViewportBottom) return;

    void loadBooks();
  }, [books.length, isLoadingMore, loadBooks]);

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
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end sm:justify-between">
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="flex w-full flex-col gap-1.5">
              <Label
                htmlFor="books-filter-keyword"
                className="text-xs font-medium text-muted-foreground"
              >
                Từ khoá
              </Label>
              <Input
                id="books-filter-keyword"
                value={keywordDraft}
                onChange={(e) => setKeywordDraft(e.target.value)}
                placeholder="Tìm theo tên / ISBN…"
                aria-label="Tìm theo từ khoá"
              />
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Label
                htmlFor="books-filter-book-status"
                className="text-xs font-medium text-muted-foreground"
              >
                Trạng thái sách
              </Label>
              <Select
                value={bookStatusFilter ?? BOOL_ALL_VALUE}
                onValueChange={(v) => {
                  if (v === BOOL_ALL_VALUE) setBookStatusFilter(null);
                  else setBookStatusFilter(v as BookStatus);
                }}
              >
                <SelectTrigger id="books-filter-book-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BOOL_ALL_VALUE}>Tất cả</SelectItem>
                  {BOOK_STATUS_OPTIONS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {BOOK_STATUS_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Label
                htmlFor="books-filter-variant-status"
                className="text-xs font-medium text-muted-foreground"
              >
                Trạng thái phiên bản
              </Label>
              <Select
                value={variantStatusFilter ?? BOOL_ALL_VALUE}
                onValueChange={(v) => {
                  if (v === BOOL_ALL_VALUE) setVariantStatusFilter(null);
                  else setVariantStatusFilter(v as BookVariantStatus);
                }}
              >
                <SelectTrigger
                  id="books-filter-variant-status"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BOOL_ALL_VALUE}>Tất cả</SelectItem>
                  {VARIANT_STATUS_OPTIONS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {VARIANT_STATUS_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Label
                htmlFor="books-filter-is-stock-valid"
                className="text-xs font-medium text-muted-foreground"
              >
                Tồn kho hợp lệ
              </Label>
              <Select
                value={
                  isStockValidFilter === null
                    ? BOOL_ALL_VALUE
                    : isStockValidFilter
                      ? BOOL_TRUE_VALUE
                      : BOOL_FALSE_VALUE
                }
                onValueChange={(v) => {
                  if (v === BOOL_ALL_VALUE) setIsStockValidFilter(null);
                  else if (v === BOOL_TRUE_VALUE) setIsStockValidFilter(true);
                  else setIsStockValidFilter(false);
                }}
              >
                <SelectTrigger
                  id="books-filter-is-stock-valid"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BOOL_ALL_VALUE}>Không lọc</SelectItem>
                  <SelectItem value={BOOL_TRUE_VALUE}>Có</SelectItem>
                  <SelectItem value={BOOL_FALSE_VALUE}>Không</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <div className={BOOK_GRID_CLASS}>
          {Array.from({ length: 8 }).map((_, i) => (
            <AdminBookCardSkeleton key={i} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          Chưa có sách nào phù hợp với bộ lọc hiện tại.
        </p>
      ) : (
        <div className={BOOK_GRID_CLASS}>
          {books.map((book) => (
            <AdminBookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      <div
        ref={loadMoreRef}
        aria-hidden
        className="h-8 w-full shrink-0"
      />

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
