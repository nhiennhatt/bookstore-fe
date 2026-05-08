"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

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
import type { BookVariant } from "@/lib/interfaces/bookVariant";
import { getImagePlaceholder } from "@/lib/utils";
import { updateVariantImage } from "@/services/bookVariants";

function variantCoverSrc(v: BookVariant): string {
  return v.image?.trim() ? v.image : "";
}

export function UpdateVariantImageDialog({
  open,
  onOpenChange,
  variant,
  bookId,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: BookVariant | null;
  bookId: string;
  onUpdated?: () => void | Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
      lastBlobUrlRef.current = null;
    }
  }, [open]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh.");
      return;
    }

    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
    }
    const blobUrl = URL.createObjectURL(selected);
    lastBlobUrlRef.current = blobUrl;
    setFile(selected);
    setPreviewUrl(blobUrl);
    setError(null);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
      lastBlobUrlRef.current = null;
    }
  };

  const submit = async () => {
    if (!variant || !file || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await updateVariantImage(variant.id, bookId, fd);
      if (res.error) {
        setError(res.error.title ?? "Không cập nhật được ảnh.");
        return;
      }
      onOpenChange(false);
      await onUpdated?.();
    } finally {
      setSubmitting(false);
    }
  };

  const currentImage = previewUrl ?? (variant ? variantCoverSrc(variant) : "");
  const hasImage = currentImage.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật ảnh phiên bản</DialogTitle>
          <DialogDescription>
            {variant
              ? `${variant.name} · ISBN ${variant.isbn}`
              : "Chọn ảnh mới cho phiên bản."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Label htmlFor="update-variant-image-file">Ảnh phiên bản</Label>
          <div className="flex flex-wrap items-start gap-3">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-md border bg-muted">
              {hasImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentImage}
                  alt="Ảnh phiên bản"
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
                id="update-variant-image-file"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={submitting}
                onChange={handleFileChange}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={submitting}
                  onClick={() =>
                    document
                      .getElementById("update-variant-image-file")
                      ?.click()
                  }
                >
                  Duyệt ảnh
                </Button>
                {file ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={submitting}
                    onClick={clearFile}
                  >
                    Gỡ ảnh
                  </Button>
                ) : null}
              </div>
              {file ? (
                <p className="truncate text-xs text-muted-foreground">
                  {file.name}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Chọn ảnh mới rồi bấm cập nhật.
                </p>
              )}
            </div>
          </div>
        </div>

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
            disabled={!file || submitting || !variant}
            onClick={() => void submit()}
          >
            {submitting ? "Đang cập nhật…" : "Cập nhật ảnh"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
