"use server";

import { revalidatePath } from "next/cache";

import type { BookStatus } from "@/lib/interfaces/book";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

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
): Promise<APIResponse<void>> {
  const res = await callAPIWrapper(() =>
    serverSecurityAxios.patch<void>(`/books/${id}`, payload),
  );
  if (!res.error) {
    revalidatePath(`/management/books/${id}`);
    revalidatePath("/management/books");
  }
  return res;
}
