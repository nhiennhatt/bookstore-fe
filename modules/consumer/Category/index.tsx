"use client";

import { Button } from "@/components/ui/button";
import { CategoryBooksCarouselSection } from "./CategoryBooksCarouselSection";
import { CategoryPageHeader } from "./CategoryPageHeader";
import { useCategoriesWithBooks } from "./useCategoriesWithBooks";

export function Category() {
  const { categories, categoryBooks, handleLoadMore, hasMore } =
    useCategoriesWithBooks();

  const booksForCategory = (categoryId: string) =>
    categoryBooks.find((entry) => entry.categoryId === categoryId)?.books ??
    [];

  return (
    <main className="grow pt-24 pb-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <CategoryPageHeader />

        <div className="space-y-20">
          {categories.map((category, categoryIndex) => (
            <CategoryBooksCarouselSection
              key={category.id}
              category={category}
              books={booksForCategory(category.id)}
              categoryIndex={categoryIndex}
            />
          ))}
        </div>
        <div className="w-full flex justify-center">
          {hasMore && (
            <Button
              variant="outline"
              className="px-12 my-4 text-gray-700 text-lg font-light"
              size="lg"
              onClick={handleLoadMore}
            >
              Tải thêm
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
