"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type BookOverview, BookStatus } from "@/lib/interfaces/book";
import { getImagePlaceholder } from "@/lib/utils";
import { cn } from "@/lib/utils/index";
import Link from "next/link";

function statusBadgeVariant(
  status: BookStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case BookStatus.ACTIVE:
      return "default";
    case BookStatus.COMING_SOON:
      return "secondary";
    case BookStatus.INACTIVE:
      return "outline";
    case BookStatus.DISCONTINUED:
      return "destructive";
    default:
      return "outline";
  }
}

function statusLabel(status: BookStatus): string {
  switch (status) {
    case BookStatus.ACTIVE:
      return "Đang bán";
    case BookStatus.INACTIVE:
      return "Ngưng hiển thị";
    case BookStatus.COMING_SOON:
      return "Sắp có";
    case BookStatus.DISCONTINUED:
      return "Ngừng phân phối";
    default:
      return status;
  }
}

export function AdminBookCard({ book }: { book: BookOverview }) {
  const categoryName = book.categoryName;
  const coverSrc = book.image?.trim()
    ? book.image
    : "/logo.webp";
  const remote = coverSrc.startsWith("http");

  return (
    <Link href={`/management/books/${book.id}`}>
      <article
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
          "transition-shadow hover:shadow-md",
        )}
      >
        <div className="relative aspect-3/4 w-full bg-muted">
          <Image
            src={coverSrc}
            alt={book.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized={remote}
            placeholder="blur"
            blurDataURL={getImagePlaceholder("#e8eaed")}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="line-clamp-2 font-semibold leading-snug">{book.name}</h2>
          {book.author ? (
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {book.author}
            </p>
          ) : null}
          <div className="grid grid-cols-1 gap-2 border-t border-border/60 pt-2 text-xs sm:grid-cols-2">
            <div className="min-w-0 sm:col-span-2">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Slug
              </p>
              <p
                className="truncate font-mono text-foreground/80"
                title={book.slug}
              >
                {book.slug}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                NXB
              </p>
              <p
                className="truncate text-foreground/80"
                title={book.publisher ?? undefined}
              >
                {book.publisher ?? "—"}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Phân phối
              </p>
              <p
                className="truncate text-foreground/80"
                title={book.distributor ?? undefined}
              >
                {book.distributor ?? "—"}
              </p>
            </div>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            <Badge variant={statusBadgeVariant(book.status)}>
              {statusLabel(book.status)}
            </Badge>
            {categoryName ? (
              <Badge variant="outline" className="max-w-full truncate">
                {categoryName}
              </Badge>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}

export function AdminBookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Skeleton className="aspect-3/4 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-5 w-[85%]" />
        <Skeleton className="h-4 w-[60%]" />
        <div className="grid grid-cols-3 gap-2 border-t pt-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-5 w-20 rounded-4xl" />
          <Skeleton className="h-5 w-16 rounded-4xl" />
        </div>
      </div>
    </div>
  );
}
