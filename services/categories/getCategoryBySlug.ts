"use server";

import type { Category } from "@/lib/interfaces/category";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /categories/slug/:slug */
export async function getCategoryBySlug(
  slug: string,
): Promise<APIResponse<Category>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<Category>(
      `/categories/slug/${encodeURIComponent(slug)}`,
    ),
  );
}
