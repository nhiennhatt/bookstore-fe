"use server";

import { revalidatePath } from "next/cache";

import type { BookVariantStatus } from "@/lib/interfaces/bookVariant";
import serverAxios from "@/lib/server/serverAxios";

export type UpdateBookVariantPayload = {
  name: string;
  isbn: string;
  originPrice?: number;
  salePrice?: number;
  inventory?: number;
  status?: BookVariantStatus;
};

export async function updateBookVariant(
  variantId: string,
  bookId: string,
  payload: UpdateBookVariantPayload,
): Promise<void> {
  await serverAxios.patch(`/variants/${variantId}`, payload);
  revalidatePath(`/management/books/${bookId}`);
  revalidatePath("/management/books");
}
