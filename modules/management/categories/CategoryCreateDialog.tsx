"use client";

import React, { useEffect, useMemo, useState } from "react";

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
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
} from "lucide-react";

import type { Category } from "@/lib/interfaces/category";
import { slugify } from "@/lib/utils";
import { checkSlugExistence } from "@/services/categories";

const MOCK_THUMBS = ["/default_avatar.webp", "/logo.webp"];
type CreateCategoryInput = Omit<Category, "id">;

export function CategoryCreateDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateCategoryInput) => void;
}) {
  const defaultThumbImg = useMemo(() => MOCK_THUMBS[0], []);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "exists" | "available" | "error"
  >("idle");
  const slugCheckRequestIdRef = React.useRef(0);
  const slugStatusRunIdRef = React.useRef(0);

  useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(() => {
      setName("");
      setSlug("");
      setIsPublic(true);
      setIsFeatured(false);
      setIsSlugManuallyEdited(false);
      setSlugStatus("idle");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const derivedSlug = slug.trim() || (name.trim() ? slugify(name, 80) : "");
    const runId = ++slugStatusRunIdRef.current;
    const scheduleSlugStatus = (
      status: "idle" | "checking" | "exists" | "available" | "error",
    ) => {
      queueMicrotask(() => {
        if (slugStatusRunIdRef.current !== runId) return;
        setSlugStatus(status);
      });
    };

    if (!derivedSlug) {
      scheduleSlugStatus("idle");
      return;
    }

    const requestId = ++slugCheckRequestIdRef.current;
    scheduleSlugStatus("checking");

    const timeoutId = window.setTimeout(async () => {
      const response = await checkSlugExistence(derivedSlug);
      if (slugCheckRequestIdRef.current !== requestId) return;
      if (response.error) {
        setSlugStatus("error");
        return;
      }
      setSlugStatus(response.data.result ? "exists" : "available");
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [name, slug, open]);

  const handleCreate = () => {
    const nextName = name.trim();
    if (!nextName) return;

    const nextSlug = slug.trim() || slugify(nextName, 80);
    if (!nextSlug) return;
    if (slugStatus === "exists" || slugStatus === "checking") return;

    onSubmit({
      name: nextName,
      slug: nextSlug,
      public: isPublic,
      featured: isFeatured,
      thumbImg: defaultThumbImg,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo danh mục</DialogTitle>
          <DialogDescription>
            Nhập thông tin danh mục mới.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm font-medium flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info className="h-3.5 w-3.5" />
            </span>
            <span>Thông tin danh mục</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-category-name">Tên danh mục</Label>
              <Input
                id="create-category-name"
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  if (!isSlugManuallyEdited) {
                    const trimmed = value.trim();
                    if (!trimmed) {
                      setSlug("");
                      return;
                    }
                    setSlug(slugify(trimmed, 80));
                  }
                }}
                placeholder="Nhập tên danh mục"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-category-slug">Slug</Label>
              <div className="relative">
                <Input
                  id="create-category-slug"
                  value={slug}
                  className="pr-10"
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="vd: van-hoc"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {slugStatus === "checking" && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {slugStatus === "available" && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                  {slugStatus === "exists" && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  {slugStatus === "error" && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              <Label>Công khai</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              <Label>Nổi bật</Label>
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
          <Button
            type="button"
            onClick={handleCreate}
            disabled={
              !name.trim() ||
              slugStatus === "checking" ||
              slugStatus === "exists"
            }
          >
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

