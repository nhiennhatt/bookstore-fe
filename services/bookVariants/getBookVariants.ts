"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { BookVariant } from "@/lib/interfaces/bookVariant";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /variants?bookid= — OpenAPI */
export async function getBookVariants(
  bookId: string,
): Promise<APIResponse<BookVariant[]>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<BookVariant[]>("/variants", {
      params: { bookid: bookId },
    }),
  );
}
