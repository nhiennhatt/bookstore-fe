"use server";

import type { BookStatus } from "@/lib/interfaces/book";
import type { BookVariantStatus } from "@/lib/interfaces/bookVariant";
import type { APIResponse } from "@/lib/interfaces/common";
import type { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /collections/{id}/books — OpenAPI */
export type GetCollectionBooksQuery = {
  cursor?: number;
  /** Tối thiểu 10, tối đa 30 */
  limit?: number;
  keyword?: string;
  bookStatus?: BookStatus;
  bookVariantStatus?: BookVariantStatus;
  isStockValid?: boolean;
};

export async function getCollectionBooks(
  collectionId: string,
  query?: GetCollectionBooksQuery,
): Promise<APIResponse<CollectionBookOverview[]>> {
  const trimmedKeyword = query?.keyword?.trim();

  const params = {
    ...(query?.cursor !== undefined ? { cursor: query.cursor } : {}),
    ...(query?.limit !== undefined ? { limit: query.limit } : {}),
    ...(trimmedKeyword ? { keyword: trimmedKeyword } : {}),
    ...(query?.bookStatus ? { bookStatus: query.bookStatus } : {}),
    ...(query?.bookVariantStatus
      ? { bookVariantStatus: query.bookVariantStatus }
      : {}),
    ...(query?.isStockValid !== undefined
      ? { isStockValid: query.isStockValid }
      : {}),
  };

  return callAPIWrapper(() =>
    serverSecurityAxios.get<CollectionBookOverview[]>(
      `/collections/${collectionId}/books`,
      { params },
    ),
  );
}
