"use server";

import { revalidatePath } from "next/cache";

import type { BookVariantStatus } from "@/lib/interfaces/bookVariant";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

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
): Promise<APIResponse<void>> {
  const res = await callAPIWrapper(() =>
    serverSecurityAxios.patch<void>(`/variants/${variantId}`, payload),
  );
  if (!res.error) {
    revalidatePath(`/management/books/${bookId}`);
    revalidatePath("/management/books");
  }
  return res;
}
