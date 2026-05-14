"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /me/addresses/:id/default */
export async function setDefaultAddress(
  id: string,
): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<void>(`/me/addresses/${id}/default`),
  );
}
