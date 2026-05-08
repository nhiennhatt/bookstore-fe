"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortableOperation, useSortable } from "@dnd-kit/react/sortable";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowLeft, ExternalLink, GripVertical, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BookCollection } from "@/lib/interfaces/collection";
import type {
  CollectionBook,
  CollectionBookOverview,
} from "@/lib/interfaces/collection-book";
import { BookStatus } from "@/lib/interfaces/book";
import { getImagePlaceholder } from "@/lib/utils";
import {
  deleteCollectionBook,
  getCollections,
  getCollectionBooks,
  updateCollectionBookPosition,
} from "@/services/collections";

import { CollectionAddBookDialog } from "./CollectionAddBookDialog";

type DragEndPayload = Parameters<
  NonNullable<ComponentProps<typeof DragDropProvider>["onDragEnd"]>
>[0];
const COLLECTION_BOOKS_PAGE_SIZE = 10;

function normalizePositions(
  items: CollectionBookOverview[],
): CollectionBookOverview[] {
  return items.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}

const STATUS_LABEL: Record<BookStatus, string> = {
  [BookStatus.ACTIVE]: "Đang bán",
  [BookStatus.INACTIVE]: "Ngưng hiển thị",
  [BookStatus.COMING_SOON]: "Sắp có",
  [BookStatus.DISCONTINUED]: "Ngừng phân phối",
};

function SortableBookRow({ row }: { row: Row<CollectionBookOverview> }) {
  const { ref, handleRef, isDragging } = useSortable({
    id: row.original.id,
    index: row.index,
  });

  return (
    <tr
      ref={ref}
      className={`border-b transition-colors hover:bg-muted/50 ${
        isDragging ? "bg-muted/60" : ""
      }`}
    >
      {row.getVisibleCells().map((cell) => {
        if (cell.column.id === "drag") {
          return (
            <TableCell key={cell.id} className="w-12">
              <button
                ref={handleRef}
                type="button"
                aria-label={`Kéo để sắp xếp ${row.original.book.name}`}
                className="inline-flex h-7 w-7 cursor-grab items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:text-foreground active:cursor-grabbing"
              >
                <GripVertical className="size-4" />
              </button>
            </TableCell>
          );
        }

        return (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </tr>
  );
}

export function CollectionDetailBase({
  collectionId,
}: {
  collectionId: string;
}) {
  const [collection, setCollection] = useState<BookCollection | null>(null);
  const [isCollectionLoading, setIsCollectionLoading] = useState(true);
  const [isCollectionMissing, setIsCollectionMissing] = useState(false);
  const [items, setItems] = useState<CollectionBookOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [addBookDialogOpen, setAddBookDialogOpen] = useState(false);

  const existingBookIds = useMemo(
    () => new Set(items.map((i) => i.book.id)),
    [items],
  );

  const loadCollection = useCallback(async () => {
    setIsCollectionLoading(true);
    setIsCollectionMissing(false);
    try {
      let page = 0;
      let found: BookCollection | null = null;

      while (true) {
        const res = await getCollections({
          page,
          limit: 10,
        });
        if (res.error) {
          console.error(res.error);
          setIsCollectionMissing(true);
          break;
        }
        const chunk = res.data;
        if (chunk.length === 0) {
          setIsCollectionMissing(true);
          break;
        }

        found = chunk.find((item) => item.id === collectionId) ?? null;
        if (found) {
          setCollection(found);
          break;
        }
        if (chunk.length < 10) {
          setIsCollectionMissing(true);
          break;
        }
        page += 1;
      }
    } catch (error) {
      console.error(error);
      setIsCollectionMissing(true);
    } finally {
      setIsCollectionLoading(false);
    }
  }, [collectionId]);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const merged: CollectionBookOverview[] = [];
      let cursor = 0;

      const limit = COLLECTION_BOOKS_PAGE_SIZE;

      while (true) {
        const res = await getCollectionBooks(collectionId, {
          cursor,
          limit,
        });
        if (res.error) {
          console.error(res.error);
          break;
        }
        const chunk = Array.isArray(res.data) ? res.data : [];
        if (chunk.length === 0) break;
        merged.push(...chunk);
        if (chunk.length < limit) break;
        cursor += chunk.length;
      }

      setItems(normalizePositions(merged));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [collectionId]);

  useEffect(() => {
    void loadCollection();
  }, [loadCollection]);

  useEffect(() => {
    if (isCollectionLoading || isCollectionMissing) {
      setIsLoading(false);
      setItems([]);
      return;
    }
    void loadBooks();
  }, [isCollectionLoading, isCollectionMissing, loadBooks]);

  const handleDeleteBook = useCallback(
    async (item: CollectionBookOverview) => {
      if (deletingBookId) return;

      const ok = window.confirm(`Xoá "${item.book.name}" khỏi bộ sưu tập này?`);
      if (!ok) return;

      setDeletingBookId(item.id);
      try {
        const res = await deleteCollectionBook(collectionId, item.book.id);
        if (res.error) {
          console.error(res.error);
          return;
        }
        setItems((prev) => normalizePositions(prev.filter((book) => book.id !== item.id)));
      } catch (error) {
        console.error(error);
      } finally {
        setDeletingBookId(null);
      }
    },
    [collectionId, deletingBookId],
  );

  const columns = useMemo<ColumnDef<CollectionBookOverview>[]>(
    () => [
      {
        id: "drag",
        header: "",
      },
      {
        id: "cover",
        header: "Bìa",
        cell: ({ row }) => {
          const book = row.original.book;
          const coverSrc = book.image?.trim() ? book.image : "/logo.webp";
          const remote = coverSrc.startsWith("http");
          return (
            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image
                src={coverSrc}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
                unoptimized={remote}
                placeholder="blur"
                blurDataURL={getImagePlaceholder("#e8eaed")}
              />
            </div>
          );
        },
      },
      {
        id: "title",
        header: "Sách",
        cell: ({ row }) => {
          const book = row.original.book;
          return (
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium leading-snug">{book.name}</span>
              {book.author ? (
                <span className="text-sm text-muted-foreground">{book.author}</span>
              ) : null}
            </div>
          );
        },
      },
      {
        id: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge variant="secondary">{STATUS_LABEL[row.original.book.status]}</Badge>
        ),
      },
      {
        id: "order",
        header: "Thứ tự",
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">{row.original.position}</span>
        ),
      },
      {
        id: "open",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-destructive"
              disabled={Boolean(deletingBookId)}
              onClick={() => void handleDeleteBook(row.original)}
              aria-label={`Xoá ${row.original.book.name} khỏi bộ sưu tập`}
            >
              <Trash2 className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-xs" asChild>
              <Link
                href={`/management/books/${row.original.book.id}`}
                aria-label={`Mở trang sách ${row.original.book.name}`}
              >
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          </div>
        ),
      },
    ],
    [deletingBookId, handleDeleteBook],
  );

  const table = useReactTable({
    data: items,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDragEnd = async (event: DragEndPayload) => {
    if (event.canceled || isUpdatingOrder || deletingBookId) return;
    if (!isSortableOperation(event.operation)) return;
    const { source } = event.operation;
    if (!source) return;

    const { initialIndex, index } = source;
    if (initialIndex === index) return;

    const previous = items;
    const next = [...items];
    const [moved] = next.splice(initialIndex, 1);
    if (!moved) return;
    next.splice(index, 0, moved);

    const normalized = normalizePositions(next);
    setItems(normalized);
    setIsUpdatingOrder(true);

    try {
      const res = await updateCollectionBookPosition(collectionId, moved.book.id, index + 1);
      if (res.error) {
        console.error(res.error);
        setItems(previous);
      }
    } catch (error) {
      console.error(error);
      setItems(previous);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleBookAddedToCollection = useCallback((created: CollectionBook) => {
    setItems((prev) => {
      const normalizedCreated: CollectionBookOverview = {
        ...created,
      };
      const createdBookId = normalizedCreated.book?.id;
      if (!createdBookId) return prev;
      if (prev.some((item) => item.book.id === createdBookId)) return prev;

      return normalizePositions(
        [...prev, normalizedCreated].sort((a, b) => a.position - b.position),
      );
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" className="w-fit gap-1 px-2" asChild>
            <Link href="/management/collections">
              <ArrowLeft className="size-4" />
              Bộ sưu tập
            </Link>
          </Button>
          <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {collection?.name ?? "Chi tiết bộ sưu tập"}
              </h1>
            <p className="text-sm text-muted-foreground">
              Kéo thả các dòng để đổi thứ tự hiển thị trong bộ sưu tập.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {collection ? (
            collection.public ? (
              <Badge>Công khai</Badge>
            ) : (
              <Badge variant="secondary">Riêng tư</Badge>
            )
          ) : null}
          <Button
            type="button"
            className="gap-2"
            disabled={isCollectionLoading || isCollectionMissing}
            onClick={() => setAddBookDialogOpen(true)}
          >
            <Plus className="size-4" />
            Thêm sách
          </Button>
        </div>
      </div>

      {isCollectionMissing ? (
        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Không tìm thấy bộ sưu tập.
        </div>
      ) : null}

      <DragDropProvider onDragEnd={handleDragEnd}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell>
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-14 w-10 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48 max-w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <SortableBookRow key={row.original.id} row={row} />
                ))}

            {!isLoading && items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Chưa có sách trong bộ sưu tập này.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </DragDropProvider>

      <CollectionAddBookDialog
        collectionId={collectionId}
        open={addBookDialogOpen}
        onOpenChange={setAddBookDialogOpen}
        existingBookIds={existingBookIds}
        onAdded={handleBookAddedToCollection}
      />
    </div>
  );
}