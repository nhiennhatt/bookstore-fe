"use client";

import { Button } from "@/components/ui/button";

export function CategorySelectLoadMoreFooter({
  hasMore,
  loading,
  onLoadMore,
}: {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) return null;
  return (
    <div
      className="border-t border-border p-1"
      onPointerDown={(e) => e.preventDefault()}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-full text-muted-foreground"
        disabled={loading}
        onClick={() => onLoadMore()}
      >
        {loading ? "Đang tải…" : "Tải thêm danh mục"}
      </Button>
    </div>
  );
}
