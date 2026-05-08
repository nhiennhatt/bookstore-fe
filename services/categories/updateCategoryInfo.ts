"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

export async function updateCategoryInfo(
  id: string,
  payload: {
    name: string;
    slug: string;
    isPublic: boolean;
    isFeatured: boolean;
  },
): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.patch<void>(`/categories/${id}`, payload),
  );
}
