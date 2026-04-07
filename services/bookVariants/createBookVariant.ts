"use server";

import { revalidatePath } from "next/cache";

import type { BookVariant, BookVariantStatus } from "@/lib/interfaces/bookVariant";
import serverAxios from "@/lib/server/serverAxios";

export type CreateBookVariantPayload = {
  bookId: string;
  name: string;
  isbn: string;
  status: BookVariantStatus;
  originPrice?: number;
  salePrice?: number;
  inventory?: number;
};

export async function createBookVariant(
  payload: CreateBookVariantPayload,
): Promise<BookVariant> {
  const { data } = await serverAxios.post<BookVariant>("/variants", payload);
  revalidatePath(`/management/books/${payload.bookId}`);
  revalidatePath("/management/books");
  return data;
}
