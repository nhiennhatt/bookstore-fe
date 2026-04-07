"use server";

import type { BookCollection } from "@/lib/interfaces/collection";
import serverAxios from "@/lib/server/serverAxios";

type QueryCollectionsPayload = {
  keyword?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
};

/** GET /collections/ — body: QueryBookCollectionValidation */
export async function getCollections(
  payload?: QueryCollectionsPayload,
): Promise<BookCollection[]> {
  const { data } = await serverAxios.get<BookCollection[]>("/collections/", {
    data: payload,
  });
  return data;
}
