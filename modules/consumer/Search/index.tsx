"use client";

import { useState, useEffect, useCallback } from "react";
import { getBooks } from "@/services/books";
import { getCategories, getCategoryBySlug } from "@/services/categories";
import { Category } from "@/lib/interfaces/category";
import { BookOverview } from "@/lib/interfaces/book";
import { SearchHeader } from "./SearchHeader";
import { CategoryFilters } from "./CategoryFilters";
import { SearchResults } from "./SearchResults";
import { useRouter } from "next/navigation";

const CATEGORIES_PER_PAGE = 4;
const BOOKS_PER_PAGE = 12;

export function Search({
  query,
  categorySlug: _categorySlug,
}: {
  query?: string;
  categorySlug?: string;
}) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | null
  >(_categorySlug || null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCursor, setCategoryCursor] = useState<string | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryHasMore, setCategoryHasMore] = useState(true);

  const [books, setBooks] = useState<BookOverview[]>([]);
  const [bookCursor, setBookCursor] = useState<string | null>(null);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookHasMore, setBookHasMore] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string | null>(query || null);
  const [keywordDraft, setKeywordDraft] = useState<string | null>(
    query || null,
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategorySlug) params.set("category", selectedCategorySlug);
    if (keyword) params.set("query", keyword);
    window.history.pushState(null, "", `/search?${params.toString()}`);
  }, [selectedCategorySlug, keyword]);

  useEffect(() => {
    const initCategories = async () => {
      if (categoryLoading) return;
      setCategoryLoading(true);
      const res = await getCategories({ limit: CATEGORIES_PER_PAGE });
      setCategoryLoading(false);
      if (res.error || !res.data) {
        setCategoryHasMore(false);
        return;
      }
      setCategories(res.data);
      setCategoryHasMore(res.data.length === CATEGORIES_PER_PAGE);
      if (res.data.length > 0) {
        setCategoryCursor(res.data[res.data.length - 1].id);
      }
    };
    initCategories();
  }, []);

  useEffect(() => {
    const initBooks = async () => {
      setBookCursor(null);
      setBookHasMore(true);
      setBookLoading(true);
      setBooks([]);
      const res = await getBooks({
        keyword: keyword || undefined,
        categoryId: selectedCategory || undefined,
        limit: BOOKS_PER_PAGE,
      });

      setBookLoading(false);
      if (res.error || !res.data) {
        setBookHasMore(false);
        return;
      }
      setBooks(res.data || []);
      setBookHasMore(res.data.length === BOOKS_PER_PAGE);
      if (res.data.length > 0) {
        setBookCursor(res.data[res.data.length - 1].id);
      }
    };
    initBooks();
  }, [keyword, selectedCategory]);

  useEffect(() => {
    const initCategory = async () => {
      if (_categorySlug) {
        const res = await getCategoryBySlug(_categorySlug);
        if (res.error || !res.data) return;
        setSelectedCategory(res.data.id);
      }
    };
    initCategory();
  }, [_categorySlug]);

  const loadMoreCategories = useCallback(async () => {
    if (categoryLoading || !categoryHasMore) return;
    setCategoryLoading(true);
    const res = await getCategories({
      cursor: categoryCursor,
      limit: CATEGORIES_PER_PAGE,
    });
    setCategoryLoading(false);
    if (res.error || !res.data) {
      setCategoryHasMore(false);
      return;
    }
    setCategories((prev) => [...prev, ...res.data]);
    setCategoryHasMore(res.data.length === CATEGORIES_PER_PAGE);
    if (res.data.length > 0) {
      setCategoryCursor(res.data[res.data.length - 1].id);
    }
  }, [categoryCursor, categoryHasMore, categoryLoading]);

  const loadMoreBooks = useCallback(async () => {
    if (bookLoading || !bookHasMore) return;
    setBookLoading(true);
    const res = await getBooks({
      cursor: bookCursor,
      limit: BOOKS_PER_PAGE,
      keyword: keyword || undefined,
      categoryId: selectedCategory || undefined,
    });
    setBookLoading(false);
    if (res.error || !res.data) {
      setBookHasMore(false);
      return;
    }
    setBooks((prev) => [...prev, ...res.data]);
    setBookHasMore(res.data.length === BOOKS_PER_PAGE);
    if (res.data.length > 0) {
      setBookCursor(res.data[res.data.length - 1].id);
    }
  }, [bookCursor, bookHasMore, bookLoading, keyword, selectedCategory]);

  const handleResetFilters = useCallback(() => {
    setKeyword(null);
    setKeywordDraft(null);
    setSelectedCategory(null);
  }, []);

  return (
    <main className="grow pt-24 pb-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <SearchHeader
          keywordDraft={keywordDraft}
          onKeywordDraftChange={setKeywordDraft}
          onSearchSubmit={() => setKeyword(keywordDraft)}
        />

        <div className="flex flex-col lg:flex-row gap-12">
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectCategorySlug={setSelectedCategorySlug}
            onClearCategory={() => {
              setSelectedCategory(null);
              setSelectedCategorySlug(null);
            }}
            categoryHasMore={categoryHasMore}
            categoryLoading={categoryLoading}
            onLoadMoreCategories={loadMoreCategories}
          />

          <SearchResults
            books={books}
            keyword={keyword}
            bookHasMore={bookHasMore}
            bookLoading={bookLoading}
            onLoadMoreBooks={loadMoreBooks}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </main>
  );
}
