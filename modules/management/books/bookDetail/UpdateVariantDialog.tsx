"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BookVariant } from "@/lib/interfaces/bookVariant";
import { updateBookVariant } from "@/services/bookVariants";

import {
  emptyVariantForm,
  parseOptionalInt,
  VariantFormFields,
  variantFormFromBookVariant,
  type VariantFormState,
} from "./variantFormShared";

export function UpdateVariantDialog({
  open,
  onOpenChange,
  variant,
  bookId,
  onUpdated,
  onOpenUpdateImage,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: BookVariant | null;
  bookId: string;
  onUpdated?: () => void | Promise<void>;
  onOpenUpdateImage?: (variant: BookVariant) => void;
}) {
  const [form, setForm] = useState<VariantFormState>(emptyVariantForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(variant ? variantFormFromBookVariant(variant) : emptyVariantForm());
    setError(null);
  }, [open, variant]);

  const submit = async () => {
    if (!variant || submitting) return;
    const name = form.name.trim();
    const isbn = form.isbn.trim();
    if (!name || !isbn) return;

    const originPrice = parseOptionalInt(form.originPrice);
    const salePrice = parseOptionalInt(form.salePrice);
    const inventory = parseOptionalInt(form.inventory);

    setError(null);
    setSubmitting(true);
    try {
      const res = await updateBookVariant(variant.id, bookId, {
        name,
        isbn,
        status: form.status,
        ...(originPrice !== undefined && originPrice >= 1 ? { originPrice } : {}),
        ...(salePrice !== undefined && salePrice >= 1 ? { salePrice } : {}),
        ...(inventory !== undefined ? { inventory } : {}),
      });
      if (res.error) {
        setError(res.error.title ?? "Không cập nhật được.");
        return;
      }
      onOpenChange(false);
      await onUpdated?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa phiên bản</DialogTitle>
          <DialogDescription>Cập nhật thông tin phiên bản đã chọn.</DialogDescription>
        </DialogHeader>
        <VariantFormFields
          form={form}
          setForm={setForm}
          idPrefix="bv-edit"
          disabled={submitting || !variant}
        />
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={submitting || !variant}
            onClick={() => {
              if (!variant) return;
              onOpenChange(false);
              onOpenUpdateImage?.(variant);
            }}
          >
            Cập nhật ảnh
          </Button>
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
            disabled={!form.name.trim() || !form.isbn.trim() || submitting}
            onClick={() => void submit()}
          >
            {submitting ? "Đang lưu…" : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
