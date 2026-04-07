import { BookDetailBase } from "@/modules/management/books/bookDetail/base";
import { getBook } from "@/services/books/getBook";
import { notFound } from "next/navigation";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;

    const book = await getBook(id);
    if (book) return <BookDetailBase book={book} />;
  } catch (error) {
    console.error(error);
  }
  return notFound();
}
