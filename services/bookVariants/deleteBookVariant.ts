"use server";

import { revalidatePath } from "next/cache";

import serverAxios from "@/lib/server/serverAxios";

export async function deleteBookVariant(
  variantId: string,
  bookId: string,
): Promise<void> {
  await serverAxios.delete(`/variants/${variantId}`);
  revalidatePath(`/management/books/${bookId}`);
  revalidatePath("/management/books");
}
