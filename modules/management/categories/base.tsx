"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryUpdateDialog } from "./CategoryUpdateDialog";
import { CategoryCreateDialog } from "./CategoryCreateDialog";
import type { Category } from "@/lib/interfaces/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCategories,
  deleteCategory,
  createCategory,
} from "@/services/categories";
import { CATEGORIES_PAGE_SIZE } from "@/lib/constants/categoriesPagination";
import { getImagePlaceholder } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const MOCK_THUMBS = ["/default_avatar.webp", "/logo.webp"];

const SEARCH_DEBOUNCE_MS = 300;
type CreateCategoryInput = Omit<Category, "id">;

export function CategoriesBase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchDraft, setSearchDraft] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const loadingCategoriesRef = useRef(false);

  const selectedCount = selectedIds.size;
  const allSelected = selectedCount > 0 && selectedCount === categories.length;
  const someSelected = selectedCount > 0 && selectedCount < categories.length;

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedKeyword(searchDraft.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(t);
  }, [searchDraft]);

  const loadCategories = useCallback(
    async (options?: { reset?: boolean }) => {
      const shouldReset = !!options?.reset;
      if (loadingCategoriesRef.current) return;
      if (!shouldReset && !hasMoreRef.current) return;

      loadingCategoriesRef.current = true;
      setIsLoadingMore(true);
      try {
        const cursorToUse = shouldReset ? null : nextCursorRef.current;
        const res = await getCategories({
          cursor: cursorToUse,
          keyword: debouncedKeyword || undefined,
          limit: CATEGORIES_PAGE_SIZE,
        });
        if (res.error) {
          console.error(res.error);
          return;
        }
        const items = res.data;

        const pageFull = items.length === CATEGORIES_PAGE_SIZE;
        const tailId =
          items.length > 0 ? items[items.length - 1]?.id ?? null : null;
        hasMoreRef.current = pageFull && Boolean(tailId);
        nextCursorRef.current = pageFull && tailId ? tailId : null;

        setCategories((prev) => {
          if (shouldReset) return items;
          const seen = new Set(prev.map((c) => c.id));
          const appended = items.filter((c) => !seen.has(c.id));
          return [...prev, ...appended];
        });
        setHasLoadedOnce(true);
      } catch (error) {
        console.error(error);
      } finally {
        loadingCategoriesRef.current = false;
        setIsLoadingMore(false);
      }
    },
    [debouncedKeyword],
  );

  useEffect(() => {
    setSelectedIds(new Set());
    hasMoreRef.current = true;
    nextCursorRef.current = null;
    void loadCategories({ reset: true });
  }, [loadCategories]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        void loadCategories();
      },
      {
        root: null,
        rootMargin: "320px 0px 320px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadCategories]);

  useEffect(() => {
    if (!headerCheckboxRef.current) return;
    headerCheckboxRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(categories.map((c) => c.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const dialogInitialCategory = useMemo(() => {
    if (!editingId) return null;
    return categories.find((c) => c.id === editingId) ?? null;
  }, [categories, editingId]);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingId(null);
  };

  const handleCreateSubmit = async (payload: CreateCategoryInput) => {
    const res = await createCategory(payload);
    if (res.error || !res.data) {
      console.error(res.error);
      return;
    }
    setCategories((prev) => [res.data, ...prev]);
  };

  const handleCategoryUpdated = (
    id: string,
    changes: Partial<Omit<Category, "id">>,
  ) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, ...changes } : category,
      ),
    );
  };

  const openCreate = () => {
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditingId(c.id);
    setDialogOpen(true);
  };

  const deleteOne = (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;

    const ok = window.confirm(`Xoá danh mục "${target.name}"?`);
    if (!ok) return;

    void deleteCategory(id).then((res) => {
      if (res.error) {
        console.error(res.error);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    });

    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    const ok = window.confirm(`Xoá ${selectedIds.size} danh mục đã chọn?`);
    if (!ok) return;

    const ids = Array.from(selectedIds);

    void Promise.all(ids.map((id) => deleteCategory(id))).then((results) => {
      const failed = results.find((r) => r.error);
      if (failed?.error) {
        console.error(failed.error);
        return;
      }
      const idSet = new Set(ids);
      setCategories((prev) => prev.filter((c) => !idSet.has(c.id)));
    });

    setSelectedIds(new Set());
  };

  const showInitialSkeleton = !hasLoadedOnce && isLoadingMore;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center">
          <Button onClick={openCreate} className="gap-2 sm:shrink-0">
            <Plus className="size-4" />
            Thêm
          </Button>
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm theo tên…"
              aria-label="Tìm danh mục theo tên"
              className="pl-9"
            />
          </div>
        </div>

        <Button
          variant="destructive"
          disabled={selectedCount === 0}
          onClick={deleteSelected}
          className="gap-2 sm:shrink-0"
        >
          <Trash2 className="size-4" />
          Xoá ({selectedCount})
        </Button>
      </div>

      {editingId && dialogInitialCategory ? (
        <CategoryUpdateDialog
          open={dialogOpen}
          onOpenChange={handleDialogOpenChange}
          initialCategory={dialogInitialCategory}
          onUpdated={handleCategoryUpdated}
        />
      ) : (
        <CategoryCreateDialog
          open={dialogOpen}
          onOpenChange={handleDialogOpenChange}
          onSubmit={handleCreateSubmit}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                disabled={showInitialSkeleton}
                aria-label="Chọn tất cả"
                className="h-4 w-4 cursor-pointer"
              />
            </TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Công khai</TableHead>
            <TableHead>Nổi bật</TableHead>
            <TableHead>Ảnh đại diện</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="w-28 text-right">Tác vụ</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {showInitialSkeleton
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell className="w-12">
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40 max-w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="size-24 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-28" />
                  </TableCell>
                  <TableCell className="w-28 text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="size-8 rounded-md" />
                      <Skeleton className="size-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleOne(c.id)}
                      aria-label={`Chọn ${c.name}`}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    {c.public ? (
                      <Badge variant="default">Công khai</Badge>
                    ) : (
                      <Badge variant="secondary">Riêng tư</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {c.featured ? (
                      <Badge>Nổi bật</Badge>
                    ) : (
                      <Badge variant="outline">Thường</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="w-24 aspect-square border border-gray-200 rounded-md">
                      <Image
                        src={c.thumbImg || MOCK_THUMBS[0]}
                        alt=""
                        width={96}
                        height={96}
                        placeholder="blur"
                        blurDataURL={getImagePlaceholder("#e5e7eb")}
                        className="object-center object-contain w-full h-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">{c.slug}</span>
                  </TableCell>
                  <TableCell className="w-28 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(c)}
                        aria-label={`Edit ${c.name}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-destructive"
                        onClick={() => deleteOne(c.id)}
                        aria-label={`Delete ${c.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

          {!showInitialSkeleton && categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-10"
              >
                {debouncedKeyword
                  ? "Không tìm thấy danh mục phù hợp."
                  : "Chưa có danh mục."}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <div ref={loadMoreRef} aria-hidden className="h-1 w-full shrink-0" />

      {hasLoadedOnce && isLoadingMore && categories.length > 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Đang tải thêm…
        </p>
      ) : null}
    </div>
  );
}
