"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { BookCollection } from "@/lib/interfaces/collection";
import { getCollections } from "./getCollections";

type GetBookCollectionByIdQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  isPublic?: boolean;
};

/** Lấy collection từ 1 lần gọi GET /collections (không tự phân trang trong service). */
export async function getBookCollectionById(
  id: string,
  query?: GetBookCollectionByIdQuery,
): Promise<APIResponse<BookCollection | null>> {
  const response = await getCollections(query);
  if (response.error) {
    return {
      data: null,
      error: response.error,
    };
  }
  return {
    data: response.data.find((c) => c.id === id) ?? null,
  };
}
