"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** DELETE /me/addresses/:id */
export async function deleteAddress(id: string): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.delete<void>(`/me/addresses/${id}`),
  );
}
