"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { BookOverview, BookStatus } from "@/lib/interfaces/book";
import { BookVariantStatus } from "@/lib/interfaces/bookVariant";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /books — query filters (OpenAPI) */
export async function getBooks(params?: {
  categoryId?: string | null;
  cursor?: string | null;
  limit?: number;
  bookStatus?: BookStatus;
  variantStatus?: BookVariantStatus;
  isStockValid?: boolean;
  keyword?: string;
}): Promise<APIResponse<BookOverview[]>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<BookOverview[]>("/books", {
      params: {
        ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
        ...(params?.cursor ? { cursor: params.cursor } : {}),
        ...(params?.limit !== undefined ? { limit: params.limit } : {}),
        ...(params?.bookStatus ? { bookStatus: params.bookStatus } : {}),
        ...(params?.variantStatus ? { variantStatus: params.variantStatus } : {}),
        ...(params?.isStockValid !== undefined
          ? { isStockValid: params.isStockValid }
          : {}),
        ...(params?.keyword ? { keyword: params.keyword } : {}),
      },
    }),
  );
}
