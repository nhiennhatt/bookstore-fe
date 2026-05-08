import { BookDetailBase } from "@/modules/management/books/bookDetail/base";
import { getBook } from "@/services/books/getBook";
import { notFound } from "next/navigation";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: book, error } = await getBook(id);
  if (error || !book) {
    console.error(error);
    return notFound();
  }

  return <BookDetailBase book={book} />;
}
