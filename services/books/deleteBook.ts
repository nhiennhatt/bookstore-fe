"use server";

import { revalidatePath } from "next/cache";

import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** DELETE /books/:id */
export async function deleteBook(id: string): Promise<APIResponse<void>> {
  const res = await callAPIWrapper(() =>
    serverSecurityAxios.delete<void>(`/books/${id}`),
  );
  if (!res.error) {
    revalidatePath("/management/books");
  }
  return res;
}
