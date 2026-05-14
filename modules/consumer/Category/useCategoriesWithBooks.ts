import { useEffect, useState } from "react";
import type { BookOverview } from "@/lib/interfaces/book";
import type { Category } from "@/lib/interfaces/category";
import { getBooks } from "@/services/books";
import { getCategories } from "@/services/categories";

export type CategoryBooksEntry = {
  categoryId: string;
  books: BookOverview[];
};

const CATEGORY_BATCH_SIZE = 2;
const BOOKS_PER_CATEGORY = 10;

export function useCategoriesWithBooks() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryBooks, setCategoryBooks] = useState<CategoryBooksEntry[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories({
        limit: CATEGORY_BATCH_SIZE,
        isPublic: true,
      });
      if (res.error || !res.data) {
        setCategories([]);
        setHasMore(false);
        setCursor(null);
        setIsLoading(false);
        return;
      }
      setCategories(res.data);
      setHasMore(res.data.length === CATEGORY_BATCH_SIZE);
      setCursor(
        res.data.length > 0 ? res.data[res.data.length - 1].id : null,
      );

      const entries = await Promise.all(
        res.data.map(async (category) => {
          const booksRes = await getBooks({
            categoryId: category.id,
            limit: BOOKS_PER_CATEGORY,
          });
          if (booksRes.error || !booksRes.data) {
            return { categoryId: category.id, books: [] };
          }
          return { categoryId: category.id, books: booksRes.data };
        }),
      );
      setCategoryBooks(entries);
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore || cursor == null) return;
    setIsLoading(true);
    const res = await getCategories({
      cursor,
      limit: CATEGORY_BATCH_SIZE,
      isPublic: true,
    });
    if (res.error || !res.data || res.data.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }
    setCategories((prev) => [...prev, ...res.data]);
    setHasMore(res.data.length === CATEGORY_BATCH_SIZE);
    setCursor(res.data[res.data.length - 1].id);

    const entries = await Promise.all(
      res.data.map(async (category) => {
        const booksRes = await getBooks({
          categoryId: category.id,
        });
        if (booksRes.error || !booksRes.data) {
          return { categoryId: category.id, books: [] };
        }
        return { categoryId: category.id, books: booksRes.data };
      }),
    );
    setCategoryBooks((prev) => [...prev, ...entries]);
    setIsLoading(false);
  };

  return { categories, categoryBooks, hasMore, handleLoadMore };
}
