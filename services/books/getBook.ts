"use server";

import type { Book } from "@/lib/interfaces/book";
import serverAxios from "@/lib/server/serverAxios";

/** GET /books/:id — OpenAPI */
export async function getBook(id: string): Promise<Book | null> {
  const response = await serverAxios.get<Book>(`/books/${id}`);
  return response.data ?? null;
}