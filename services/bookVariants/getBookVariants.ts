"use server";

import type { BookVariant } from "@/lib/interfaces/bookVariant";
import serverAxios from "@/lib/server/serverAxios";

/** GET /variants?bookid= — OpenAPI */
export async function getBookVariants(bookId: string): Promise<BookVariant[]> {
  const response = await serverAxios.get<BookVariant[]>("/variants", {
    params: { bookid: bookId },
  });
  return response.data ?? [];
}
