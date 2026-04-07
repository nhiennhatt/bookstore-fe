"use server";

import { revalidatePath } from "next/cache";

import serverAxios from "@/lib/server/serverAxios";

export async function updateBookCategory(
  bookId: string,
  payload: { categoryId: string },
): Promise<void> {
  await serverAxios.put(`/books/${bookId}/category`, payload);
  revalidatePath(`/management/books/${bookId}`);
  revalidatePath("/management/books");
}
