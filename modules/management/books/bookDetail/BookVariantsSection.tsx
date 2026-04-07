"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { isAxiosError } from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type BookVariant } from "@/lib/interfaces/bookVariant";
import { deleteBookVariant, getBookVariants } from "@/services/bookVariants";
import { cn } from "@/lib/utils/cn";
import { getImagePlaceholder } from "@/lib/utils";

import { CreateVariantDialog } from "./CreateVariantDialog";
import { UpdateVariantDialog } from "./UpdateVariantDialog";
import { UpdateVariantImageDialog } from "./UpdateVariantImageDialog";
import {
  STATUS_LABELS,
} from "./variantFormShared";

function variantCoverSrc(v: BookVariant): string {
  return v.image?.trim() ? v.image : "/logo.webp";
}

function formatMoney(n: number | undefined): string {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString("vi-VN");
}

export function BookVariantsSection({
  bookId,
  className,
}: {
  bookId: string;
  className?: string;
}) {
  const [variants, setVariants] = useState<BookVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);

  const [editVariant, setEditVariant] = useState<BookVariant | null>(null);
  const [updateImageVariant, setUpdateImageVariant] =
    useState<BookVariant | null>(null);

  const [imagePreviewVariant, setImagePreviewVariant] =
    useState<BookVariant | null>(null);

  const load = useCallback(async () => {
    setListError(null);
    setLoading(true);
    try {
      const list = await getBookVariants(bookId);
      setVariants(list);
    } catch (err) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { title?: string } | undefined;
        setListError(
          data?.title ?? err.message ?? "Không tải được danh sách phiên bản.",
        );
      } else {
        setListError("Không tải được danh sách phiên bản.");
      }
      setVariants([]);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (v: BookVariant) => {
    if (
      !window.confirm(
        `Xóa phiên bản "${v.name}" (ISBN ${v.isbn})? Hành động không hoàn tác.`,
      )
    ) {
      return;
    }
    try {
      await deleteBookVariant(v.id, bookId);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className={cn("border-t pt-8 mt-8", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Phiên bản sách
          </h2>
          <p className="text-sm text-muted-foreground">
            Mỗi phiên bản có ISBN, giá và tồn kho riêng.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm phiên bản
        </Button>
      </div>

      {listError ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {listError}
        </p>
      ) : null}

      <div className="mt-4 rounded-lg border">
        {loading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-3/4" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Ảnh</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead className="text-right">Giá gốc</TableHead>
                <TableHead className="text-right">Giá bán</TableHead>
                <TableHead className="text-right">Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[100px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-16 text-center text-muted-foreground"
                  >
                    Chưa có phiên bản nào.
                  </TableCell>
                </TableRow>
              ) : (
                variants.map((v) => {
                  const thumbSrc = variantCoverSrc(v);
                  const thumbRemote = thumbSrc.startsWith("http");
                  return (
                    <TableRow key={v.id}>
                      <TableCell className="w-16 py-2">
                        <button
                          type="button"
                          className={cn(
                            "relative size-11 shrink-0 overflow-hidden rounded-md border bg-muted outline-none transition-opacity hover:opacity-90",
                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          )}
                          onClick={() => setImagePreviewVariant(v)}
                          aria-label={`Xem ảnh phiên bản ${v.name}`}
                        >
                          <Image
                            src={thumbSrc}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="44px"
                            unoptimized={thumbRemote}
                            placeholder="blur"
                            blurDataURL={getImagePlaceholder("#e8eaed")}
                          />
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell className="tabular-nums">{v.isbn}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(v.originPrice)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(v.salePrice)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {v.inventory ?? "—"}
                      </TableCell>
                      <TableCell>{STATUS_LABELS[v.status]}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            className="shrink-0"
                          onClick={() => setEditVariant(v)}
                            aria-label={`Sửa ${v.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            className="shrink-0 text-destructive hover:text-destructive"
                            onClick={() => void handleDelete(v)}
                            aria-label={`Xóa ${v.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog
        open={imagePreviewVariant !== null}
        onOpenChange={(open) => {
          if (!open) setImagePreviewVariant(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ảnh phiên bản</DialogTitle>
            <DialogDescription>
              {imagePreviewVariant
                ? `${imagePreviewVariant.name} · ISBN ${imagePreviewVariant.isbn}`
                : null}
            </DialogDescription>
          </DialogHeader>
          {imagePreviewVariant ? (
            <div className="relative flex min-h-[200px] w-full max-h-[min(75vh,36rem)] items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={variantCoverSrc(imagePreviewVariant)}
                alt={`Ảnh ${imagePreviewVariant.name}`}
                className="max-h-[min(75vh,36rem)] w-full object-contain"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <CreateVariantDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        bookId={bookId}
        onCreated={load}
      />

      <UpdateVariantDialog
        open={editVariant !== null}
        onOpenChange={(open) => {
          if (!open) setEditVariant(null);
        }}
        variant={editVariant}
        bookId={bookId}
        onUpdated={load}
        onOpenUpdateImage={setUpdateImageVariant}
      />

      <UpdateVariantImageDialog
        open={updateImageVariant !== null}
        onOpenChange={(open) => {
          if (!open) setUpdateImageVariant(null);
        }}
        variant={updateImageVariant}
        bookId={bookId}
        onUpdated={load}
      />
    </section>
  );
}
