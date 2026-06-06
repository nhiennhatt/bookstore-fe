"use server";

import { revalidatePath } from "next/cache";

import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

export async function deleteBookVariant(
  variantId: string,
  bookId: string,
): Promise<APIResponse<void>> {
  const res = await callAPIWrapper(() =>
    serverSecurityAxios.delete<void>(`/variants/${variantId}`),
  );
  if (!res.error) {
    revalidatePath(`/management/books/${bookId}`);
    revalidatePath("/management/books");
  }
  return res;
}
