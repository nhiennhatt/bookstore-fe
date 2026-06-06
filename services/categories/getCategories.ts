"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import { Category } from "@/lib/interfaces/category";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /categories — query: cursor?, keyword?, limit?, isPublic?, isFeatured? */
export async function getCategories({
  cursor,
  keyword,
  limit,
  isPublic,
  isFeatured,
}: {
  cursor?: string | null;
  keyword?: string | null;
  limit?: number;
  isPublic?: boolean;
  isFeatured?: boolean;
}): Promise<APIResponse<Category[]>> {
  const trimmed = keyword?.trim();
  return callAPIWrapper(() =>
    serverSecurityAxios.get<Category[]>("/categories", {
      params: {
        ...(cursor ? { cursor } : {}),
        ...(trimmed ? { keyword: trimmed } : {}),
        ...(limit ? { limit } : {}),
        ...(typeof isPublic === "boolean" ? { isPublic } : {}),
        ...(typeof isFeatured === "boolean" ? { isFeatured } : {}),
      },
    }),
  );
}
