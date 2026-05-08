import { BookDetail } from "@/lib/interfaces/book";
import { BookInform } from "./BookInform";

export function BookDetails({ book }: { book: BookDetail }) {
  return <BookInform book={book} />;
}
