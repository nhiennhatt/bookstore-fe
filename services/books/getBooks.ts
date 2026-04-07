"use server";

import type { Book } from "@/lib/interfaces/book";
import serverAxios from "@/lib/server/serverAxios";

/** GET /books — query: categoryId?, cursor? (OpenAPI) */
export async function getBooks(params?: {
  categoryId?: string | null;
  cursor?: string | null;
}): Promise<Book[]> {
  const response = await serverAxios.get<Book[]>("/books", {
    params: {
      ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });
  return response.data;
}
