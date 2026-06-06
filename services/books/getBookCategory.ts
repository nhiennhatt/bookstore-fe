"use server";

import type { Category } from "@/lib/interfaces/category";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /books/:id/category */
export async function getBookCategory(
  bookId: string,
): Promise<APIResponse<Category>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<Category>(`/books/${bookId}/category`),
  );
}
