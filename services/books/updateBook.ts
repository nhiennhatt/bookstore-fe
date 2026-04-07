"use server";

import { revalidatePath } from "next/cache";

import type { Book, BookStatus } from "@/lib/interfaces/book";
import serverAxios from "@/lib/server/serverAxios";

export type UpdateBookPayload = {
  name?: string;
  author?: string;
  description?: string;
  publisher?: string;
  distributor?: string;
  slug?: string;
  status?: BookStatus;
};

export async function updateBook(
  id: string,
  payload: UpdateBookPayload,
): Promise<void> {
  await serverAxios.patch<Book>(`/books/${id}`, payload);
  revalidatePath(`/management/books/${id}`);
  revalidatePath("/management/books");
}
