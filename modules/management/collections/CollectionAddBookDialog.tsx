"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { CollectionBook } from "@/lib/interfaces/collection-book";
import type { BookOverview } from "@/lib/interfaces/book";
import { BOOKS_PAGE_SIZE } from "@/lib/constants/booksPagination";
import { getImagePlaceholder } from "@/lib/utils";
import { getBooks } from "@/services/books";
import { addBookToCollection } from "@/services/collections";

const SEARCH_DEBOUNCE_MS = 300;

export function CollectionAddBookDialog({
  collectionId,
  open,
  onOpenChange,
  existingBookIds,
  onAdded,
}: {
  collectionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingBookIds: ReadonlySet<string>;
  onAdded: (item: CollectionBook) => void;
}) {
  const [searchDraft, setSearchDraft] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [books, setBooks] = useState<BookOverview[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [justAddedBookIds, setJustAddedBookIds] = useState<Set<string>>(new Set());
  const [addError, setAddError] = useState<string | null>(null);

  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const listLoadingRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  /** Luôn khớp debouncedKeyword + được reset về "" ngay khi mở dialog (tránh fetch stale keyword). */
  const debouncedKeywordRef = useRef(debouncedKeyword);
  debouncedKeywordRef.current = debouncedKeyword;

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedKeyword(searchDraft.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(t);
  }, [searchDraft]);

  const applyPageMeta = useCallback((batch: BookOverview[], cursorUsed: string | null) => {
    const tailId =
      batch.length > 0 ? batch[batch.length - 1]?.id ?? null : null;
    const more =
      batch.length > 0 &&
      Boolean(tailId) &&
      Boolean(tailId && tailId !== cursorUsed);
    hasMoreRef.current = more;
    nextCursorRef.current = more && tailId ? tailId : null;
    setHasMore(more);
  }, []);

  const loadPage = useCallback(
    async (options: { reset: boolean }) => {
      if (listLoadingRef.current) return;
      listLoadingRef.current = true;
      const shouldReset = options.reset;
      if (shouldReset) {
        setListLoading(true);
        nextCursorRef.current = null;
        hasMoreRef.current = true;
      } else {
        setLoadMoreLoading(true);
      }
      try {
        const cursorToUse = shouldReset ? null : nextCursorRef.current;
        const kw = debouncedKeywordRef.current.trim() || undefined;
        const booksRes = await getBooks({
          categoryId: null,
          cursor: cursorToUse,
          limit: BOOKS_PAGE_SIZE,
          keyword: kw,
        });
        if (booksRes.error || !booksRes.data) {
          console.error(booksRes.error);
          return;
        }
        const batch = booksRes.data;

        applyPageMeta(batch, cursorToUse);

        setBooks((prev) => {
          if (shouldReset) return batch;
          const seen = new Set(prev.map((b) => b.id));
          const appended = batch.filter((b) => !seen.has(b.id));
          return [...prev, ...appended];
        });
      } catch (error) {
        console.error(error);
      } finally {
        listLoadingRef.current = false;
        setListLoading(false);
        setLoadMoreLoading(false);
      }
    },
    [applyPageMeta, debouncedKeyword],
  );

  useEffect(() => {
    if (!open) return;
    const root = scrollContainerRef.current;
    const target = loadMoreRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (listLoadingRef.current || !hasMoreRef.current) return;
        void loadPage({ reset: false });
      },
      {
        root,
        rootMargin: "0px 0px 180px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [open, loadPage]);

  useEffect(() => {
    if (!open) return;
    debouncedKeywordRef.current = "";
    setSearchDraft("");
    setDebouncedKeyword("");
    setBooks([]);
    setAddError(null);
    setAddingId(null);
    setJustAddedBookIds(new Set());
    hasMoreRef.current = true;
    nextCursorRef.current = null;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    void loadPage({ reset: true });
  }, [open, debouncedKeyword, loadPage]);

  const handleAdd = async (book: BookOverview) => {
    if (existingBookIds.has(book.id) || justAddedBookIds.has(book.id) || addingId)
      return;
    setAddError(null);
    setAddingId(book.id);
    try {
      const res = await addBookToCollection(collectionId, book.id);
      if (res.error) {
        console.error(res.error);
        setAddError("Không thêm được sách. Có thể sách đã có trong bộ sưu tập.");
        return;
      }
      const created = res.data;
      setJustAddedBookIds((prev) => {
        const next = new Set(prev);
        next.add(book.id);
        return next;
      });
      onAdded(created);
    } catch (error) {
      console.error(error);
      setAddError("Không thêm được sách. Có thể sách đã có trong bộ sưu tập.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,640px)] w-full flex-col gap-0 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm sách vào bộ sưu tập</DialogTitle>
          <DialogDescription>
            Tìm theo tên, tác giả hoặc slug. Tìm kiếm trong sách đã tải; bấm "Tải
            thêm" để nạp thêm danh sách từ hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 border-b py-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collection-add-book-search">Tìm sách</Label>
            <Input
              id="collection-add-book-search"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tên sách, tác giả..."
              disabled={listLoading}
            />
          </div>
          {addError ? (
            <p className="text-sm text-destructive" role="alert">
              {addError}
            </p>
          ) : null}
        </div>

        <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto py-2">
          {listLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-12 shrink-0 rounded-md" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-4 max-w-[200px] w-[65%]" />
                    <Skeleton className="h-3 max-w-[120px] w-[45%]" />
                  </div>
                  <Skeleton className="h-8 w-16 shrink-0" />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {debouncedKeyword
                ? "Không có sách khớp từ khóa. Thử từ khóa khác hoặc \"Tải thêm\"."
                : "Không có sách nào."}
            </p>
          ) : (
            <ul className="flex flex-col gap-1 pr-1">
              {books.map((book) => {
                const already =
                  existingBookIds.has(book.id) || justAddedBookIds.has(book.id);
                const coverSrc = book.image?.trim() ? book.image : "/logo.webp";
                const remote = coverSrc.startsWith("http");
                const busy = addingId === book.id;
                return (
                  <li
                    key={book.id}
                    className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 hover:bg-muted/50"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={coverSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized={remote}
                        placeholder="blur"
                        blurDataURL={getImagePlaceholder("#e8eaed")}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium leading-snug">{book.name}</p>
                      {book.author ? (
                        <p className="truncate text-sm text-muted-foreground">
                          {book.author}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={already ? "secondary" : "default"}
                      disabled={already || busy}
                      onClick={() => void handleAdd(book)}
                    >
                      {busy ? "..." : already ? "Đã có" : "Thêm"}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
          <div ref={loadMoreRef} aria-hidden className="h-1 w-full shrink-0" />
        </div>

        <DialogFooter className="flex-col gap-2 border-t pt-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={!hasMore || listLoading || loadMoreLoading}
            onClick={() => void loadPage({ reset: false })}
          >
            {loadMoreLoading ? "Đang tải..." : hasMore ? "Tải thêm sách" : "Đã tải hết"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
