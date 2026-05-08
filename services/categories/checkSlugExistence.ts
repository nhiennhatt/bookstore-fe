"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import { serverNoSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /categories/slug/:slug/valid — BooleanDto (không yêu cầu Bearer trong OpenAPI) */
export async function checkSlugExistence(
  slug: string,
): Promise<APIResponse<{ result: boolean }>> {
  return callAPIWrapper(() =>
    serverNoSecurityAxios.get<{ result: boolean }>(
      `/categories/slug/${encodeURIComponent(slug)}/valid`,
    ),
  );
}
