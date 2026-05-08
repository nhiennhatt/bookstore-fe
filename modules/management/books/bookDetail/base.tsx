"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImageIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Book, BookStatus } from "@/lib/interfaces/book";
import { getImagePlaceholder, slugify } from "@/lib/utils";
import {
  deleteBook,
  updateBook,
  updateBookCategory,
  updateBookImage,
} from "@/services/books";

import { BookVariantsSection } from "./BookVariantsSection";

const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  [BookStatus.ACTIVE]: "Đang bán",
  [BookStatus.INACTIVE]: "Ngưng hiển thị",
  [BookStatus.COMING_SOON]: "Sắp có",
  [BookStatus.DISCONTINUED]: "Ngừng phân phối",
};

const BOOK_STATUS_OPTIONS = Object.values(BookStatus) as BookStatus[];

const CATEGORY_NONE_VALUE = "__none__";

function categoryIdFromBook(book: Book): string {
  return book.categoryId ?? book.category?.id ?? "";
}

export function BookDetailBase({ book }: { book: Book }) {
  const router = useRouter();
  const [name, setName] = useState(book.name);
  const [author, setAuthor] = useState(book.author ?? "");
  const [description, setDescription] = useState(book.description ?? "");
  const [publisher, setPublisher] = useState(book.publisher ?? "");
  const [distributor, setDistributor] = useState(book.distributor ?? "");
  const [slug, setSlug] = useState(book.slug);
  const [status, setStatus] = useState<BookStatus>(book.status);
  const [categoryId, setCategoryId] = useState(() => categoryIdFromBook(book));
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const coverPreviewBlobRef = useRef<string | null>(null);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [isSavingCover, setIsSavingCover] = useState(false);

  useEffect(() => {
    return () => {
      if (coverPreviewBlobRef.current) {
        URL.revokeObjectURL(coverPreviewBlobRef.current);
        coverPreviewBlobRef.current = null;
      }
    };
  }, []);

  const resetCoverPicker = () => {
    if (coverPreviewBlobRef.current) {
      URL.revokeObjectURL(coverPreviewBlobRef.current);
      coverPreviewBlobRef.current = null;
    }
    setPendingCoverFile(null);
    setCoverPreviewUrl(null);
    setCoverImageError(null);
  };

  const handleCoverFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCoverImageError("Vui lòng chọn file ảnh.");
      return;
    }
    resetCoverPicker();
    const url = URL.createObjectURL(file);
    coverPreviewBlobRef.current = url;
    setPendingCoverFile(file);
    setCoverPreviewUrl(url);
    setCoverDialogOpen(true);
  };

  const handleCoverDialogOpenChange = (open: boolean) => {
    setCoverDialogOpen(open);
    if (!open) {
      resetCoverPicker();
    }
  };

  const handleSaveCover = async () => {
    if (!pendingCoverFile || isSavingCover) return;
    setCoverImageError(null);
    setIsSavingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", pendingCoverFile);
      const res = await updateBookImage(book.id, formData);
      if (res.error) {
        setCoverImageError(res.error.title ?? "Không tải ảnh lên được.");
        return;
      }
      setCoverDialogOpen(false);
      resetCoverPicker();
      router.refresh();
    } finally {
      setIsSavingCover(false);
    }
  };

  useEffect(() => {
    setName(book.name);
    setAuthor(book.author ?? "");
    setDescription(book.description ?? "");
    setPublisher(book.publisher ?? "");
    setDistributor(book.distributor ?? "");
    setSlug(book.slug);
    setStatus(book.status);
    setCategoryId(categoryIdFromBook(book));
    setIsSlugManuallyEdited(false);
    setSaveError(null);
  }, [book]);

  const handleSave = async () => {
    const nextName = name.trim();
    if (!nextName || isSaving) return;

    const nextSlug = slug.trim() || slugify(nextName, 80);
    if (!nextSlug) return;

    setSaveError(null);
    setIsSaving(true);
    try {
      const updateRes = await updateBook(book.id, {
        name: nextName,
        slug: nextSlug,
        status,
        author: author.trim() || undefined,
        description: description.trim() || undefined,
        publisher: publisher.trim() || undefined,
        distributor: distributor.trim() || undefined,
      });
      if (updateRes.error) {
        setSaveError(updateRes.error.title ?? "Không lưu được.");
        return;
      }

      const previousCategoryId = categoryIdFromBook(book);
      const nextCategoryId = categoryId.trim();
      if (nextCategoryId && nextCategoryId !== previousCategoryId) {
        const catRes = await updateBookCategory(book.id, {
          categoryId: nextCategoryId,
        });
        if (catRes.error) {
          setSaveError(catRes.error.title ?? "Không cập nhật danh mục được.");
          return;
        }
      }

      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = async () => {
    if (isDeleting) return;
    setDeleteError(null);
    setIsDeleting(true);
    try {
      const delRes = await deleteBook(book.id);
      if (delRes.error) {
        setDeleteError(delRes.error.title ?? "Không xóa được sách.");
        return;
      }
      setDeleteDialogOpen(false);
      router.push("/management/books");
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  const currentCoverSrc = book.image?.trim() ? book.image : "/logo.webp";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-1.5 px-2" asChild>
          <Link href="/management/books">
            <ArrowLeft className="h-4 w-4" />
            Danh sách sách
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Chi tiết sách</h1>
        <p className="text-sm text-muted-foreground">
          Thông tin sách, ảnh bìa và các phiên bản (ISBN, giá, tồn kho).
        </p>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-0 rounded-none border-0 border-b border-border bg-transparent p-0"
        >
          <TabsTrigger value="info" className="rounded-none px-4 py-2.5">
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="variants" className="rounded-none px-4 py-2.5">
            Phiên bản
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6 flex flex-col gap-6 outline-none">
      <Field>
        <FieldLabel htmlFor="book-detail-cover-file-input">Ảnh bìa</FieldLabel>
        <div className="flex w-full flex-col gap-3">
          <div className="relative aspect-3/4 w-full max-h-[min(50vh,28rem)] overflow-hidden rounded-md border bg-muted">
            <Image
              key={`${book.id}-${currentCoverSrc}`}
              src={currentCoverSrc}
              alt={`Ảnh bìa hiện tại: ${book.name}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 42rem"
              placeholder="blur"
              blurDataURL={getImagePlaceholder("#e8eaed")}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <input
              ref={coverFileInputRef}
              id="book-detail-cover-file-input"
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={isSaving || isSavingCover}
              onChange={handleCoverFileChange}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit gap-1.5"
              disabled={isSaving || isSavingCover}
              onClick={() => coverFileInputRef.current?.click()}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Chọn ảnh mới
            </Button>
          </div>
        </div>
        <FieldDescription>
          Chọn ảnh để xem trước trong hộp thoại, rồi bấm Lưu ảnh để cập nhật.
        </FieldDescription>
        {coverImageError && !coverDialogOpen ? (
          <p className="text-sm text-destructive" role="alert">
            {coverImageError}
          </p>
        ) : null}
      </Field>

      <Dialog open={coverDialogOpen} onOpenChange={handleCoverDialogOpenChange}>
        <DialogContent
          className="sm:max-w-md"
          showCloseButton={!isSavingCover}
          onPointerDownOutside={(e) => {
            if (isSavingCover) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (isSavingCover) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Xem trước ảnh bìa</DialogTitle>
            <DialogDescription>
              Kiểm tra ảnh trước khi tải lên máy chủ.
            </DialogDescription>
          </DialogHeader>
          {coverPreviewUrl ? (
            <div className="relative aspect-3/4 w-full max-h-[50vh] overflow-hidden rounded-lg border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPreviewUrl}
                alt="Xem trước ảnh bìa"
                className="h-full w-full object-contain"
              />
            </div>
          ) : null}
          {pendingCoverFile ? (
            <p className="truncate text-xs text-muted-foreground">
              {pendingCoverFile.name}
            </p>
          ) : null}
          {coverImageError ? (
            <p className="text-sm text-destructive" role="alert">
              {coverImageError}
            </p>
          ) : null}
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isSavingCover}
              onClick={() => handleCoverDialogOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!pendingCoverFile || isSavingCover}
              onClick={handleSaveCover}
            >
              {isSavingCover ? "Đang lưu…" : "Lưu ảnh"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="book-detail-name">Tên sách</FieldLabel>
          <Input
            id="book-detail-name"
            value={name}
            disabled={isSaving}
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
        </Field>

        <Field>
          <FieldLabel htmlFor="book-detail-slug">Slug</FieldLabel>
          <Input
            id="book-detail-slug"
            value={slug}
            disabled={isSaving}
            onChange={(e) => {
              setIsSlugManuallyEdited(true);
              setSlug(e.target.value);
            }}
            placeholder="vd: nha-gia-kim-abc123"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="book-detail-status">Trạng thái</FieldLabel>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as BookStatus)}
            disabled={isSaving}
          >
            <SelectTrigger id="book-detail-status" className="w-full">
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
        </Field>

        <Field>
          <FieldLabel htmlFor="book-detail-category">Danh mục</FieldLabel>
          <CategorySearchableSelect
            value={categoryId || CATEGORY_NONE_VALUE}
            onValueChange={(v) => {
              if (v === CATEGORY_NONE_VALUE) {
                setCategoryId("");
              } else {
                setCategoryId(v);
              }
            }}
            sentinelOption={{
              value: CATEGORY_NONE_VALUE,
              label: "Không gán danh mục",
            }}
            disabled={isSaving}
            triggerId="book-detail-category"
            triggerClassName="w-full"
            placeholder="Chọn danh mục"
          />
          <FieldDescription>
            Đổi sang danh mục khác sẽ được lưu. Gỡ danh mục có thể cần thao tác
            riêng trên máy chủ.
          </FieldDescription>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="book-detail-author">Tác giả</FieldLabel>
            <Input
              id="book-detail-author"
              value={author}
              disabled={isSaving}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Không bắt buộc"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="book-detail-publisher">Nhà xuất bản</FieldLabel>
            <Input
              id="book-detail-publisher"
              value={publisher}
              disabled={isSaving}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Không bắt buộc"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="book-detail-distributor">Nhà phân phối</FieldLabel>
          <Input
            id="book-detail-distributor"
            value={distributor}
            disabled={isSaving}
            onChange={(e) => setDistributor(e.target.value)}
            placeholder="Không bắt buộc"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="book-detail-description">Mô tả</FieldLabel>
          <textarea
            id="book-detail-description"
            value={description}
            disabled={isSaving}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Không bắt buộc"
            className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </Field>
      </FieldGroup>

      {saveError ? (
        <p className="text-sm text-destructive" role="alert">
          {saveError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={!name.trim() || isSaving}
        >
          {isSaving ? "Đang lưu…" : "Lưu thay đổi"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="gap-1.5"
          disabled={isSaving || isDeleting}
          onClick={() => {
            setDeleteError(null);
            setDeleteDialogOpen(true);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xóa sách
        </Button>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>Xóa sách?</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa sách{" "}
              <span className="font-medium text-foreground">“{book.name}”</span>
              ? Toàn bộ phiên bản liên quan cũng sẽ bị xóa theo quy tắc máy chủ.
              Hành động không hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
          ) : null}
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void handleDeleteBook()}
            >
              {isDeleting ? "Đang xóa…" : "Xóa vĩnh viễn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </TabsContent>

        <TabsContent value="variants" className="mt-6 outline-none">
          <BookVariantsSection
            bookId={book.id}
            className="mt-0 border-0 pt-0"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
