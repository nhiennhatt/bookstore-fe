"use client";

import { motion, AnimatePresence } from "motion/react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookOverview } from "@/lib/interfaces/book";
import { SearchResultBookCard } from "./SearchResultBookCard";

type SearchResultsProps = {
  books: BookOverview[];
  keyword: string | null;
  bookHasMore: boolean;
  bookLoading: boolean;
  onLoadMoreBooks: () => void;
  onResetFilters: () => void;
};

export function SearchResults({
  books,
  keyword,
  bookHasMore,
  bookLoading,
  onLoadMoreBooks,
  onResetFilters,
}: SearchResultsProps) {
  return (
    <div className="grow">
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm text-cool-slate font-medium">
          Tìm thấy{" "}
          <strong className="text-deep-charcoal font-bold">
            {books.length}
          </strong>{" "}
          kết quả
          {keyword && (
            <span>
              {" "}
              cho "<span className="text-electric-indigo">{keyword}</span>"
            </span>
          )}
        </div>
      </div>

      {books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {books.map((book, index) => (
                <SearchResultBookCard
                  key={book.id}
                  book={book}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
          {bookHasMore && (
            <Button
              disabled={bookLoading}
              onClick={onLoadMoreBooks}
              className="w-full my-16 py-4 text-lg text-mauve-600 font-normal"
              variant="outline"
            >
              Tải thêm
            </Button>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-vapor-white rounded-3xl border border-dashed border-border/50"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-cool-slate shadow-sm">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-deep-charcoal mb-2">
            Không tìm thấy sách phù hợp
          </h3>
          <p className="text-cool-slate max-w-sm mx-auto">
            Hãy thử thay đổi từ khóa hoặc bộ lọc để tìm thấy cuốn sách bạn đang
            tìm kiếm.
          </p>
          <Button
            variant="outline"
            className="mt-8 rounded-xl border-border px-8"
            onClick={onResetFilters}
          >
            Đặt lại tất cả
          </Button>
        </motion.div>
      )}
    </div>
  );
}
