"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CategoryDialog } from "@/modules/management/categories/CategoryDialog";
import type { Category } from "@/lib/interfaces/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategories } from "@/services/categories/getCategories";

const MOCK_THUMBS = ["/default_avatar.webp", "/logo.webp"];

const initialCategories: Category[] = [
  {
    id: "cat_1",
    name: "Văn học",
    isPublic: true,
    thumbImg: "/logo.webp",
    slug: "van-hoc",
  },
  {
    id: "cat_2",
    name: "Kinh tế",
    isPublic: true,
    thumbImg: "/default_avatar.webp",
    slug: "kinh-te",
  },
  {
    id: "cat_3",
    name: "Thiếu nhi",
    isPublic: false,
    thumbImg: "/logo.webp",
    slug: "thieu-nhi",
  },
];

export function CategoriesBase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);

  const selectedCount = selectedIds.size;
  const allSelected = selectedCount > 0 && selectedCount === categories.length;
  const someSelected = selectedCount > 0 && selectedCount < categories.length;

  useEffect(() => {
    getCategories().then((categories) => {
      setCategories(categories);
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);

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

  const handleDialogSubmit = (payload: Omit<Category, "id">) => {
    setCategories((prev) => {
      if (editingId) {
        return prev.map((c) =>
          c.id === editingId ? { ...c, ...payload } : c,
        );
      }

      const id = `cat_${Date.now().toString(16)}_${Math.random()
        .toString(16)
        .slice(2)}`;
      return [{ id, ...payload }, ...prev];
    });
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

    setCategories((prev) => prev.filter((c) => c.id !== id));
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

    setCategories((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
  };

  const selectedCategories = useMemo(() => {
    if (selectedIds.size === 0) return [];
    return categories.filter((c) => selectedIds.has(c.id));
  }, [categories, selectedIds]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
            <Button onClick={openCreate} className="gap-2">
              <Plus className="size-4" />
              Thêm
            </Button>
        </div>

        <Button
          variant="destructive"
          disabled={selectedCount === 0}
          onClick={deleteSelected}
          className="gap-2"
        >
          <Trash2 className="size-4" />
          Xoá ({selectedCount})
        </Button>
      </div>

        <CategoryDialog
          open={dialogOpen}
          onOpenChange={handleDialogOpenChange}
          initialCategory={dialogInitialCategory}
          onSubmit={handleDialogSubmit}
        />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Chọn tất cả"
                className="h-4 w-4 cursor-pointer"
              />
            </TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Công khai</TableHead>
            <TableHead>Ảnh đại diện</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="w-28 text-right">Tác vụ</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.map((c) => (
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
                <Switch
                  checked={c.isPublic}
                  onCheckedChange={(checked) => {
                    setCategories((prev) =>
                      prev.map((x) =>
                        x.id === c.id ? { ...x, isPublic: checked } : x,
                      ),
                    );
                  }}
                  aria-label={`Toggle isPublic ${c.name}`}
                />
              </TableCell>
              <TableCell>
                <div className="w-24 aspect-square border border-gray-200 rounded-md">
                  <Image
                    src={c.thumbImg || MOCK_THUMBS[0]}
                    alt=""
                    width={96}
                    height={96}
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

          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                Chưa có danh mục.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
