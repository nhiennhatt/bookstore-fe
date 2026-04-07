"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Image as ImageLucide,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";

import type { Category } from "@/lib/interfaces/category";
import { getImagePlaceholder, slugify } from "@/lib/utils";
import { checkSlugExistence } from "@/services/categories/checkSlugExistence";
import { updateCategoryInfo } from "@/services/categories/updateCategoryInfo";
import { updateCategoryThumb } from "@/services/categories/updateCategoryThumb";

const MOCK_THUMBS = ["/default_avatar.webp", "/logo.webp"];

export function CategoryUpdateDialog({
  open,
  onOpenChange,
  initialCategory,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategory: Category | null;
  onUpdated?: (id: string, changes: Partial<Omit<Category, "id">>) => void;
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
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState<"info" | "thumb">("info");
  const lastBlobUrlRef = useRef<string | null>(null);
  const slugCheckRequestIdRef = useRef(0);
  const slugStatusRunIdRef = useRef(0);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "exists" | "available" | "error"
  >("idle");

  useEffect(() => {
    if (!open) return;

    const nextName = initialCategory?.name ?? "";
    const nextSlug = initialCategory?.slug ?? "";
    const nextIsPublic = initialCategory?.public ?? true;
    const nextThumbImg = initialCategory?.thumbImg ?? MOCK_THUMBS[0];

    const timeoutId = window.setTimeout(() => {
      setName(nextName);
      setSlug(nextSlug);
      setIsPublic(nextIsPublic);
      setThumbImg(nextThumbImg);
      setIsSlugManuallyEdited(false);
      setThumbFile(null);
      setSlugStatus("idle");
    }, 0);

    // Nếu trước đó đã chọn file local (blob:), thu hồi để tránh leak.
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
      lastBlobUrlRef.current = null;
    }

    return () => window.clearTimeout(timeoutId);
  }, [initialCategory, open]);

  useEffect(() => {
    return () => {
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
    };
  }, []);

  const handleCreateSubmit = () => {
    // Dialog này hiện chỉ dùng cho chỉnh sửa, không dùng để tạo mới.
    onOpenChange(false);
  };

  const handleUpdateInfo = async () => {
    if (!initialCategory?.id) return;
    const nextName = name.trim();
    if (!nextName) return;

    const nextSlug = slug.trim() || slugify(nextName, 80);
    if (!nextSlug) return;
    if (slugStatus === "exists" || slugStatus === "checking") return;

    await updateCategoryInfo(initialCategory.id, {
      name: nextName,
      slug: nextSlug,
      isPublic,
    });

    onUpdated?.(initialCategory.id, {
      name: nextName,
      slug: nextSlug,
      public: isPublic,
    });
    onOpenChange(false);
  };

  const handleUpdateThumb = async () => {
    if (!initialCategory?.id) return;
    if (!thumbFile) return; // endpoint expects an image file
    await updateCategoryThumb(
      initialCategory.id,
      (() => {
        const fd = new FormData();
        fd.append("file", thumbFile);
        return fd;
      })(),
    );

    onUpdated?.(initialCategory.id, {
      thumbImg,
    });
    onOpenChange(false);
  };

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

    // Khi đang sửa đúng slug cũ của chính bản ghi này thì không cần check.
    if (
      isEditing &&
      initialCategory?.slug &&
      derivedSlug === initialCategory.slug
    ) {
      scheduleSlugStatus("available");
      return;
    }

    const requestId = ++slugCheckRequestIdRef.current;
    scheduleSlugStatus("checking");

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await checkSlugExistence(derivedSlug);
        if (slugCheckRequestIdRef.current !== requestId) return;
        setSlugStatus(response.result ? "exists" : "available");
      } catch {
        if (slugCheckRequestIdRef.current !== requestId) return;
        setSlugStatus("error");
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [slug, name, open, isEditing, initialCategory?.slug]);

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

        <div className="flex flex-col gap-4 pt-4">
          <Collapsible
            open={activeSection === "info"}
            onOpenChange={(open) => {
              if (open) setActiveSection("info");
            }}
          >
            <CollapsibleTrigger
              className="flex w-full items-center justify-between rounded-md border bg-muted/60 px-3 py-2 text-sm font-medium outline-none ring-offset-background transition hover:bg-muted data-[state=open]:bg-background data-[state=open]:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setActiveSection("info")}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Info className="h-3.5 w-3.5" />
                </span>
                <span>Thông tin danh mục</span>
              </div>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-180"
                data-state={activeSection === "info" ? "open" : "closed"}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 flex flex-col gap-3 animate-in fade-in-0 slide-in-from-top-1">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-name">Tên danh mục</Label>
                <Input
                  id="category-name"
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

                      if (
                        isEditing &&
                        initialCategory?.name &&
                        trimmed === initialCategory.name.trim()
                      ) {
                        setSlug(initialCategory?.slug ?? "");
                        return;
                      }

                      setSlug(slugify(trimmed, 80));
                    }
                  }}
                  placeholder="Nhập tên danh mục"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-slug">Slug</Label>
                <div className="relative">
                  <Input
                    id="category-slug"
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
                      <XCircle className="h-4 w-4 text-destructive" />
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

              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={
                    slugStatus === "checking" || slugStatus === "exists"
                  }
                  onClick={isEditing ? handleUpdateInfo : handleCreateSubmit}
                >
                  Lưu thông tin
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={activeSection === "thumb"}
            onOpenChange={(open) => {
              if (open) setActiveSection("thumb");
            }}
          >
            <CollapsibleTrigger
              className="flex w-full items-center justify-between rounded-md border bg-muted/60 px-3 py-2 text-sm font-medium outline-none ring-offset-background transition hover:bg-muted data-[state=open]:bg-background data-[state=open]:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setActiveSection("thumb")}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ImageLucide className="h-3.5 w-3.5" />
                </span>
                <span>Thumbnail danh mục</span>
              </div>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-180"
                data-state={activeSection === "thumb" ? "open" : "closed"}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 flex flex-col gap-3 animate-in fade-in-0 slide-in-from-top-1">
              <div className="flex flex-col gap-1.5">
                <Label>Ảnh danh mục</Label>

                <div className="flex items-start gap-3">
                  <div className="relative size-32 overflow-hidden rounded-md border bg-background">
                    {thumbImg?.startsWith("blob:") ? (
                      <img
                        src={thumbImg}
                        alt="Thumbnail preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={thumbImg || MOCK_THUMBS[0]}
                        alt="Thumbnail preview"
                        fill
                        sizes="128px"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={getImagePlaceholder("#e5e7eb")}
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <div className="text-sm text-muted-foreground">
                      Xem trước ảnh
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <input
                        id="category-thumb-browse"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          if (lastBlobUrlRef.current) {
                            URL.revokeObjectURL(lastBlobUrlRef.current);
                          }

                          const blobUrl = URL.createObjectURL(file);
                          lastBlobUrlRef.current = blobUrl;
                          setThumbFile(file);
                          setThumbImg(blobUrl);
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          document
                            .getElementById("category-thumb-browse")
                            ?.click();
                        }}
                      >
                        Chọn ảnh
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={isEditing ? !thumbFile : false}
                  onClick={isEditing ? handleUpdateThumb : handleCreateSubmit}
                >
                  Lưu thumbnail
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Xong
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
