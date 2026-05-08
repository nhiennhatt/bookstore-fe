"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentProps } from "react";
import Link from "next/link";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortableOperation, useSortable } from "@dnd-kit/react/sortable";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

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
import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
  updateCollectionPriority,
} from "@/services/collections";
import { CollectionCreateDialog } from "./CollectionCreateDialog";
import { CollectionUpdateDialog } from "./CollectionUpdateDialog";

const COLLECTIONS_PAGE_SIZE = 10;
type DragEndPayload = Parameters<
  NonNullable<ComponentProps<typeof DragDropProvider>["onDragEnd"]>
>[0];

function normalizePriority(items: BookCollection[]): BookCollection[] {
  return items.map((item, index) => ({
    ...item,
    priority: index + 1,
  }));
}

function SortableCollectionRow({ row }: { row: Row<BookCollection> }) {
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
                aria-label={`Kéo để sắp xếp ${row.original.name}`}
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

export function CollectionsBase() {
  const [collections, setCollections] = useState<BookCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);

  const loadCollections = useCallback(async () => {
    setIsLoading(true);
    try {
      const merged: BookCollection[] = [];
      let page = 0;

      while (true) {
        const res = await getCollections({
          page,
          limit: COLLECTIONS_PAGE_SIZE,
        });
        if (res.error) {
          console.error(res.error);
          break;
        }
        const chunk = Array.isArray(res.data) ? res.data : [];
        if (chunk.length === 0) break;
        merged.push(...chunk);
        if (chunk.length < COLLECTIONS_PAGE_SIZE) break;
        page += 1;
      }

      const sorted = [...merged].sort((a, b) => a.priority - b.priority);
      setCollections(normalizePriority(sorted));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCollections();
  }, [loadCollections]);

  const handleDeleteCollection = useCallback(async (collection: BookCollection) => {
    const ok = window.confirm(`Xóa bộ sưu tập "${collection.name}"?`);
    if (!ok) return;

    try {
      const res = await deleteCollection(collection.id);
      if (res.error) {
        console.error(res.error);
        return;
      }
      setCollections((prev) =>
        normalizePriority(prev.filter((item) => item.id !== collection.id)),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleOpenUpdateDialog = useCallback((collection: BookCollection) => {
    setEditingCollectionId(collection.id);
    setUpdateDialogOpen(true);
  }, []);

  const handleUpdateCollection = useCallback(
    async (id: string, payload: Pick<BookCollection, "name" | "public">) => {
      const res = await updateCollection(id, payload);
      if (res.error) {
        console.error(res.error);
        return;
      }
      setCollections((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...payload } : item)),
      );
    },
    [],
  );

  const editingCollection = useMemo(() => {
    if (!editingCollectionId) return null;
    return collections.find((item) => item.id === editingCollectionId) ?? null;
  }, [collections, editingCollectionId]);

  const columns = useMemo<ColumnDef<BookCollection>[]>(
    () => [
      {
        id: "drag",
        header: "",
      },
      {
        accessorKey: "name",
        header: "Tên bộ sưu tập",
        cell: ({ row }) => (
          <Link
            href={`/management/collections/${row.original.id}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        accessorKey: "public",
        header: "Trạng thái",
        cell: ({ row }) =>
          row.original.public ? (
            <Badge>Công khai</Badge>
          ) : (
            <Badge variant="secondary">Riêng tư</Badge>
          ),
      },
      {
        id: "actions",
        header: "Tác vụ",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleOpenUpdateDialog(row.original)}
              aria-label={`Cập nhật ${row.original.name}`}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-destructive"
              onClick={() => void handleDeleteCollection(row.original)}
              aria-label={`Xóa ${row.original.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleDeleteCollection, handleOpenUpdateDialog],
  );

  const table = useReactTable({
    data: collections,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCreateCollection = async (
    payload: Pick<BookCollection, "name" | "public">,
  ) => {
    const res = await createCollection(payload);
    if (res.error) {
      console.error(res.error);
      return;
    }
    const created = res.data;
    setCollections((prev) =>
      normalizePriority([
        ...prev,
        {
          ...created,
          priority: prev.length + 1,
        },
      ]),
    );
  };

  const handleDragEnd = async (event: DragEndPayload) => {
    if (event.canceled || isUpdatingPriority) return;
    if (!isSortableOperation(event.operation)) return;
    const { source } = event.operation;
    if (!source) return;

    const { initialIndex, index } = source;
    if (initialIndex === index) return;

    const previous = collections;
    const next = [...collections];
    const [moved] = next.splice(initialIndex, 1);
    if (!moved) return;
    next.splice(index, 0, moved);

    const normalized = normalizePriority(next);
    setCollections(normalized);
    setIsUpdatingPriority(true);

    try {
      const res = await updateCollectionPriority(moved.id, index + 1);
      if (res.error) {
        console.error(res.error);
        setCollections(previous);
      }
    } catch (error) {
      console.error(error);
      setCollections(previous);
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Bộ sưu tập</h1>
        <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="size-4" />
          Tạo bộ sưu tập
        </Button>
      </div>

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
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40 max-w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <SortableCollectionRow key={row.original.id} row={row} />
                ))}

            {!isLoading && collections.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-muted-foreground"
                >
                  Chưa có bộ sưu tập.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </DragDropProvider>

      <CollectionCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCollection}
      />
      <CollectionUpdateDialog
        open={updateDialogOpen}
        onOpenChange={(open) => {
          setUpdateDialogOpen(open);
          if (!open) setEditingCollectionId(null);
        }}
        initialCollection={editingCollection}
        onSubmit={handleUpdateCollection}
      />
    </div>
  );
}