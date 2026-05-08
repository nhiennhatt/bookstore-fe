import { BookDetails } from "@/modules/consumer/Books/details";
import { getBookBySlug } from "@/services/books";
import { notFound } from "next/navigation";

export default async function BookPage({ params }: { params: Promise<{ bookSlug: string }> }) {
  const { bookSlug } = await params;
  const { data: book, error } = await getBookBySlug(bookSlug);
  if (error || !book) {
    console.error(error);
    return notFound();
  }
  return <BookDetails book={book} />;
}