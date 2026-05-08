"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

export async function deleteCategory(id: string): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.delete<void>(`/categories/${id}`),
  );
}
