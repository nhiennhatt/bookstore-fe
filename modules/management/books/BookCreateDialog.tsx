"use client";

import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon } from "lucide-react";

import { CategorySearchableSelect } from "@/components/commons/CategorySearchableSelect";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Book, BookStatus } from "@/lib/interfaces/book";
import type { Category } from "@/lib/interfaces/category";
import { getImagePlaceholder, slugify } from "@/lib/utils";
import { createBook, updateBookImage } from "@/services/books";

const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  [BookStatus.ACTIVE]: "Đang bán",
  [BookStatus.INACTIVE]: "Ngưng hiển thị",
  [BookStatus.COMING_SOON]: "Sắp có",
  [BookStatus.DISCONTINUED]: "Ngừng phân phối",
};

const BOOK_STATUS_OPTIONS = Object.values(BookStatus) as BookStatus[];

const CATEGORY_NONE_VALUE = "__none__";

type CreateBookPayload = Pick<
  Book,
  | "name"
  | "author"
  | "description"
  | "publisher"
  | "distributor"
  | "slug"
  | "status"
> & {
  categoryId?: string;
};

export function BookCreateDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (book: Book) => void;
}) {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");
  const [distributor, setDistributor] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<BookStatus>(BookStatus.ACTIVE);
  const [categoryId, setCategoryId] = useState("");
  const [pickedCategory, setPickedCategory] = useState<Category | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lastBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
        lastBlobUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const timeoutId = window.setTimeout(() => {
      setName("");
      setAuthor("");
      setDescription("");
      setPublisher("");
      setDistributor("");
      setSlug("");
      setStatus(BookStatus.ACTIVE);
      setCategoryId("");
      setPickedCategory(null);
      setCoverFile(null);
      setCoverPreviewUrl(null);
      setIsSlugManuallyEdited(false);
      setIsSubmitting(false);
    }, 0);

    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
      lastBlobUrlRef.current = null;
    }

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  const handleCreate = async () => {
    const nextName = name.trim();
    if (!nextName || isSubmitting) return;

    const nextSlug = slug.trim() || slugify(nextName, 80);
    if (!nextSlug) return;

    const payload: CreateBookPayload = {
      name: nextName,
      author: author.trim() || undefined,
      description: description.trim() || undefined,
      publisher: publisher.trim() || undefined,
      distributor: distributor.trim() || undefined,
      slug: nextSlug,
      status,
      ...(categoryId ? { categoryId } : {}),
    };

    setIsSubmitting(true);
    try {
      const created = await createBook(payload);
      const category =
        categoryId &&
        pickedCategory &&
        pickedCategory.id === categoryId
          ? pickedCategory
          : undefined;
      let finalBook: Book = category
        ? { ...created, categoryId, category }
        : created;

      if (coverFile) {
        try {
          const formData = new FormData();
          formData.append("file", coverFile);
          const afterImage = await updateBookImage(created.id, formData);
          if (afterImage) {
            finalBook = { ...created, image: afterImage.result };
          }
        } catch (imageError) {
          console.error(imageError);
        }
      }

      onCreated(finalBook);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tạo sách mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin cơ bản để tạo một sách mới.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 pt-1">
          <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm font-medium flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImageIcon className="h-3.5 w-3.5" />
            </span>
            <span>Ảnh bìa (tuỳ chọn)</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-book-cover-file">Chọn ảnh</Label>
            <div className="flex flex-wrap items-start gap-3">
              <div className="relative size-28 shrink-0 overflow-hidden rounded-md border bg-muted">
                {coverPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverPreviewUrl}
                    alt="Xem trước ảnh bìa"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getImagePlaceholder("#e8eaed")}
                    alt=""
                    className="h-full w-full object-cover opacity-80"
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  id="create-book-cover-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (lastBlobUrlRef.current) {
                      URL.revokeObjectURL(lastBlobUrlRef.current);
                    }
                    const blobUrl = URL.createObjectURL(file);
                    lastBlobUrlRef.current = blobUrl;
                    setCoverFile(file);
                    setCoverPreviewUrl(blobUrl);
                    e.target.value = "";
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={() =>
                      document.getElementById("create-book-cover-file")?.click()
                    }
                  >
                    Duyệt ảnh
                  </Button>
                  {coverFile ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={isSubmitting}
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreviewUrl(null);
                        if (lastBlobUrlRef.current) {
                          URL.revokeObjectURL(lastBlobUrlRef.current);
                          lastBlobUrlRef.current = null;
                        }
                      }}
                    >
                      Gỡ ảnh
                    </Button>
                  ) : null}
                </div>
                {coverFile ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {coverFile.name}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Sau khi tạo sách, ảnh sẽ được tải lên tự động.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="create-book-name">Tên sách</Label>
            <Input
              id="create-book-name"
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                if (!isSlugManuallyEdited) {
                  const trimmed = value.trim();
                  setSlug(trimmed ? slugify(trimmed, 80) : "");
                }
              }}
              placeholder="Nhập tên sách"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="create-book-slug">Slug</Label>
            <Input
              id="create-book-slug"
              value={slug}
              onChange={(e) => {
                setIsSlugManuallyEdited(true);
                setSlug(e.target.value);
              }}
              placeholder="vd: nha-gia-kim-abc123"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="create-book-status">Trạng thái</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as BookStatus)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="create-book-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BOOK_STATUS_OPTIONS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {BOOK_STATUS_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="create-book-category">Danh mục</Label>
            <CategorySearchableSelect
              value={categoryId || CATEGORY_NONE_VALUE}
              onValueChange={(v, cat) => {
                if (v === CATEGORY_NONE_VALUE) {
                  setCategoryId("");
                  setPickedCategory(null);
                } else {
                  setCategoryId(v);
                  setPickedCategory(cat ?? null);
                }
              }}
              sentinelOption={{
                value: CATEGORY_NONE_VALUE,
                label: "Không gán danh mục",
              }}
              disabled={isSubmitting}
              triggerId="create-book-category"
              triggerClassName="w-full"
              placeholder="Chọn danh mục"
            />
          </div>

          <div className="grid gap-1.5 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="create-book-author">Tác giả</Label>
              <Input
                id="create-book-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Không bắt buộc"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="create-book-publisher">Nhà xuất bản</Label>
              <Input
                id="create-book-publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Không bắt buộc"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="create-book-distributor">Nhà phân phối</Label>
            <Input
              id="create-book-distributor"
              value={distributor}
              onChange={(e) => setDistributor(e.target.value)}
              placeholder="Không bắt buộc"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="create-book-description">Mô tả</Label>
            <textarea
              id="create-book-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Không bắt buộc"
              className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || isSubmitting}>
            {isSubmitting ? "Đang xử lý…" : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
