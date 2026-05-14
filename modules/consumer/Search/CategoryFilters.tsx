"use client";

import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/interfaces/category";

type CategoryFiltersProps = {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
  onClearCategory: () => void;
  categoryHasMore: boolean;
  categoryLoading: boolean;
  onLoadMoreCategories: () => void;
  onSelectCategorySlug: (slug: string) => void;
};

export function CategoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  onClearCategory,
  categoryHasMore,
  categoryLoading,
  onLoadMoreCategories,
  onSelectCategorySlug,
}: CategoryFiltersProps) {
  return (
    <aside className="lg:w-64 shrink-0 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-deep-charcoal/50">
            Thể loại
          </h3>
          {selectedCategory && (
            <Button
              variant="ghost"
              className="p-0 h-auto"
              onClick={onClearCategory}
            >
              <Delete className="size-5 text-destructive" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onSelectCategorySlug(cat.slug);
              }}
              className={cn(
                "px-4 py-4 rounded-xl text-sm font-medium transition-all text-left justify-start",
                selectedCategory === cat.id
                  ? "bg-deep-charcoal text-white shadow-md shadow-deep-charcoal/10"
                  : "bg-vapor-white text-cool-slate hover:bg-white hover:shadow-sm",
              )}
            >
              {cat.name}
            </Button>
          ))}
          {categoryHasMore && (
            <Button
              disabled={categoryLoading}
              onClick={onLoadMoreCategories}
              className="w-full"
              variant="outline"
            >
              Tải thêm
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
