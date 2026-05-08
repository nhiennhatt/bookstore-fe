"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getImagePlaceholder } from "@/lib/utils";
import { createBookVariant, updateVariantImage } from "@/services/bookVariants";

import {
  emptyVariantForm,
  parseOptionalInt,
  VariantFormFields,
  type VariantFormState,
} from "./variantFormShared";

export function CreateVariantDialog({
  open,
  onOpenChange,
  bookId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  onCreated?: () => void | Promise<void>;
}) {
  const [form, setForm] = useState<VariantFormState>(emptyVariantForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
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
    setForm(emptyVariantForm());
    setError(null);
    setCoverFile(null);
    setCoverPreviewUrl(null);
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
      lastBlobUrlRef.current = null;
    }
  }, [open]);

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh.");
      return;
    }
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
    }
    const blobUrl = URL.createObjectURL(file);
    lastBlobUrlRef.current = blobUrl;
    setCoverFile(file);
    setCoverPreviewUrl(blobUrl);
    setError(null);
  };

  const clearCover = () => {
    setCoverFile(null);
    setCoverPreviewUrl(null);
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
      lastBlobUrlRef.current = null;
    }
  };

  const submit = async () => {
    const name = form.name.trim();
    const isbn = form.isbn.trim();
    if (!name || !isbn || submitting) return;

    const originPrice = parseOptionalInt(form.originPrice);
    const salePrice = parseOptionalInt(form.salePrice);
    const inventory = parseOptionalInt(form.inventory);

    setError(null);
    setSubmitting(true);
    try {
      const createdRes = await createBookVariant({
        bookId,
        name,
        isbn,
        status: form.status,
        ...(originPrice !== undefined && originPrice >= 1
          ? { originPrice }
          : {}),
        ...(salePrice !== undefined && salePrice >= 1 ? { salePrice } : {}),
        ...(inventory !== undefined ? { inventory } : {}),
      });

      if (createdRes.error || !createdRes.data) {
        setError(createdRes.error?.title ?? "Không tạo được.");
        return;
      }
      const created = createdRes.data;

      if (coverFile) {
        const fd = new FormData();
        fd.append("file", coverFile);
        const imgRes = await updateVariantImage(created.id, bookId, fd);
        if (imgRes.error) {
          console.error(imgRes.error);
        }
      }

      onOpenChange(false);
      await onCreated?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm phiên bản</DialogTitle>
          <DialogDescription>
            Nhập thông tin phiên bản mới cho sách này.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 pt-1">
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm font-medium">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImageIcon className="h-3.5 w-3.5" />
            </span>
            <span>Ảnh phiên bản (tuỳ chọn)</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-variant-cover-file">Chọn ảnh</Label>
            <div className="flex flex-wrap items-start gap-3">
              <div className="relative size-28 shrink-0 overflow-hidden rounded-md border bg-muted">
                {coverPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverPreviewUrl}
                    alt="Xem trước ảnh phiên bản"
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
                  id="create-variant-cover-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={submitting}
                  onChange={handleCoverChange}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={submitting}
                    onClick={() =>
                      document
                        .getElementById("create-variant-cover-file")
                        ?.click()
                    }
                  >
                    Duyệt ảnh
                  </Button>
                  {coverFile ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={submitting}
                      onClick={clearCover}
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
                    Sau khi tạo phiên bản, ảnh sẽ được tải lên tự động.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <VariantFormFields
          form={form}
          setForm={setForm}
          idPrefix="bv-create"
          disabled={submitting}
        />
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={
              !form.name.trim() || !form.isbn.trim() || submitting
            }
            onClick={() => void submit()}
          >
            {submitting ? "Đang lưu…" : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
