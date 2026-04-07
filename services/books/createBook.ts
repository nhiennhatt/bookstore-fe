"use server";

import type { Book } from "@/lib/interfaces/book";
import serverAxios from "@/lib/server/serverAxios";

type CreateBookPayload = Pick<
  Book,
  | "name"
  | "author"
  | "description"
  | "publisher"
  | "distributor"
  | "slug"
  | "status"
> & {
  categoryId?: string;
};

export async function createBook(payload: CreateBookPayload): Promise<Book> {
  const response = await serverAxios.post<Book>("/books", payload);
  return response.data;
}
