"use server";

import { revalidatePath } from "next/cache";

import serverAxios from "@/lib/server/serverAxios";

/** DELETE /books/:id — OpenAPI */
export async function deleteBook(id: string): Promise<void> {
  await serverAxios.delete(`/books/${id}`);
  revalidatePath("/management/books");
}
