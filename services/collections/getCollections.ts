"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { BookCollection } from "@/lib/interfaces/collection";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

type QueryCollectionsPayload = {
  keyword?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
};

/** GET /collections — query: keyword?, isPublic?, page?, limit? */
export async function getCollections(
  payload?: QueryCollectionsPayload,
): Promise<APIResponse<BookCollection[]>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<BookCollection[]>("/collections", {
      params: payload,
    }),
  );
}
