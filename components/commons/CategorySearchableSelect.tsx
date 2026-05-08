"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CategorySelectLoadMoreFooter } from "@/components/commons/CategorySelectLoadMore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES_PAGE_SIZE } from "@/lib/constants/categoriesPagination";
import type { Category } from "@/lib/interfaces/category";
import { getCategories } from "@/services/categories";

const SEARCH_DEBOUNCE_MS = 300;

export type CategorySearchableSelectProps = {
  value: string;
  onValueChange: (nextValue: string, pickedCategory?: Category | null) => void;
  sentinelOption: { value: string; label: string };
  disabled?: boolean;
  triggerId?: string;
  triggerClassName?: string;
  placeholder?: string;
};

export function CategorySearchableSelect({
  value,
  onValueChange,
  sentinelOption,
  disabled,
  triggerId,
  triggerClassName,
  placeholder = "Chọn danh mục",
}: CategorySearchableSelectProps) {
  const [searchDraft, setSearchDraft] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const categoryByIdRef = useRef<Map<string, Category>>(new Map());
  const fetchSeqRef = useRef(0);

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedKeyword(searchDraft.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(t);
  }, [searchDraft]);

  const applyPageMeta = useCallback((batch: Category[]) => {
    for (const c of batch) {
      categoryByIdRef.current.set(c.id, c);
    }
    const pageFull = batch.length === CATEGORIES_PAGE_SIZE;
    const tailId =
      batch.length > 0 ? batch[batch.length - 1]?.id ?? null : null;
    const more = pageFull && Boolean(tailId);
    hasMoreRef.current = more;
    nextCursorRef.current = more && tailId ? tailId : null;
    setHasMore(more);
  }, []);

  useEffect(() => {
    const seq = ++fetchSeqRef.current;
    let cancelled = false;
    setLoadingList(true);
    setCategories([]);
    nextCursorRef.current = null;
    hasMoreRef.current = false;
    setHasMore(false);
    void (async () => {
      try {
        const res = await getCategories({
          limit: CATEGORIES_PAGE_SIZE,
          keyword: debouncedKeyword || undefined,
        });
        if (res.error) {
          console.error(res.error);
          return;
        }
        const batch = res.data;
        if (cancelled || seq !== fetchSeqRef.current) return;
        setCategories(batch);
        applyPageMeta(batch);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled && seq === fetchSeqRef.current) {
          setLoadingList(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedKeyword, applyPageMeta]);

  const loadMoreCategories = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;
    const gen = fetchSeqRef.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const res = await getCategories({
        cursor: nextCursorRef.current,
        limit: CATEGORIES_PAGE_SIZE,
        keyword: debouncedKeyword || undefined,
      });
      if (res.error) {
        console.error(res.error);
        return;
      }
      const batch = res.data;
      if (gen !== fetchSeqRef.current) return;
      applyPageMeta(batch);
      setCategories((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        const appended = batch.filter((c) => !seen.has(c.id));
        return [...prev, ...appended];
      });
    } catch (e) {
      console.error(e);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [debouncedKeyword, applyPageMeta]);

  const idsInList = new Set(categories.map((c) => c.id));
  const sticky =
    value &&
    value !== sentinelOption.value &&
    !idsInList.has(value)
      ? categoryByIdRef.current.get(value)
      : undefined;

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v === sentinelOption.value) {
          onValueChange(v, null);
          return;
        }
        const picked =
          categories.find((c) => c.id === v) ??
          categoryByIdRef.current.get(v) ??
          null;
        onValueChange(v, picked);
      }}
      disabled={disabled}
      onOpenChange={(open) => {
        if (!open) setSearchDraft("");
      }}
    >
      <SelectTrigger id={triggerId} className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div
          className="border-b border-border p-1.5 pb-2"
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Tìm danh mục…"
            className="h-8"
            disabled={disabled}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <SelectItem value={sentinelOption.value}>
          {sentinelOption.label}
        </SelectItem>
        {sticky ? (
          <SelectItem value={sticky.id}>{sticky.name}</SelectItem>
        ) : null}
        {loadingList ? (
          <div className="px-2 py-2 text-xs text-muted-foreground">
            Đang tải…
          </div>
        ) : null}
        {!loadingList && categories.length === 0 ? (
          <div className="px-2 py-2 text-xs text-muted-foreground">
            Không có danh mục phù hợp.
          </div>
        ) : null}
        {categories.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
        <CategorySelectLoadMoreFooter
          hasMore={hasMore && !loadingList}
          loading={loadingMore}
          onLoadMore={() => void loadMoreCategories()}
        />
      </SelectContent>
    </Select>
  );
}
