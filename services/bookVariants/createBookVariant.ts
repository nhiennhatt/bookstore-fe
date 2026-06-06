"use server";

import { revalidatePath } from "next/cache";

import type { APIResponse } from "@/lib/interfaces/common";
import type {
  BookVariant,
  BookVariantStatus,
} from "@/lib/interfaces/bookVariant";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

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
): Promise<APIResponse<BookVariant>> {
  const res = await callAPIWrapper(() =>
    serverSecurityAxios.post<BookVariant>("/variants", payload),
  );
  if (!res.error) {
    revalidatePath(`/management/books/${payload.bookId}`);
    revalidatePath("/management/books");
  }
  return res;
}
