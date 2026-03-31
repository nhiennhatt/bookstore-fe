"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Category } from "@/lib/interfaces/category";

const MOCK_THUMBS = ["/default_avatar.webp", "/logo.webp"];

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryDialog({
  open,
  onOpenChange,
  initialCategory,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategory: Category | null;
  onSubmit: (payload: Omit<Category, "id">) => void;
}) {
  const isEditing = !!initialCategory;

  const defaultThumbImg = useMemo(() => {
    if (initialCategory?.thumbImg) return initialCategory.thumbImg;
    return MOCK_THUMBS[0];
  }, [initialCategory]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [thumbImg, setThumbImg] = useState(defaultThumbImg);

  useEffect(() => {
    if (!open) return;

    setName(initialCategory?.name ?? "");
    setSlug(initialCategory?.slug ?? "");
    setIsPublic(initialCategory?.isPublic ?? true);
    setThumbImg(initialCategory?.thumbImg ?? MOCK_THUMBS[0]);
  }, [initialCategory, open]);

  const handleSave = () => {
    const nextName = name.trim();
    if (!nextName) return;

    const nextSlug = (slug.trim() || slugify(nextName)).replace(/^-+|-+$/g, "");
    if (!nextSlug) return;

    onSubmit({
      name: nextName,
      slug: nextSlug,
      isPublic,
      thumbImg: thumbImg || MOCK_THUMBS[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa danh mục" : "Tạo danh mục"}
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin để hiển thị danh mục trên trang storefront.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                // Nếu slug đang rỗng hoặc user chưa sửa thủ công, tự sinh theo name.
                setSlug((prev) => (prev.trim() ? prev : slugify(value)));
              }}
              placeholder="Nhập tên danh mục"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-slug">Slug</Label>
            <Input
              id="category-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="vd: van-hoc"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            <Label>isPublic</Label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-thumb">thumbImg</Label>
            <Input
              id="category-thumb"
              value={thumbImg}
              onChange={(e) => setThumbImg(e.target.value)}
              placeholder="/default_avatar.webp hoặc URL ảnh"
            />

            <div className="flex items-center gap-3">
              <Image
                src={thumbImg || MOCK_THUMBS[0]}
                alt=""
                width={44}
                height={44}
                className="rounded-md object-cover"
              />
              <div className="text-sm text-muted-foreground">
                Xem trước thumbnail
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

