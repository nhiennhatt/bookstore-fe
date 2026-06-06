"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { BookDetail } from "@/lib/interfaces/book";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /books/:slug/slug — OpenAPI */
export async function getBookBySlug(
  slug: string,
): Promise<APIResponse<BookDetail>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<BookDetail>(`/books/${slug}/slug`),
  );
}
