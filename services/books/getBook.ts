"use server";

import type { BookDetail } from "@/lib/interfaces/book";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /books/:id — OpenAPI getBookById → BookDetailDto */
export async function getBook(id: string): Promise<APIResponse<BookDetail>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<BookDetail>(`/books/${id}`),
  );
}
