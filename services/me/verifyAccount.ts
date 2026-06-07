"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /me/verify */
export async function verifyAccount({
  code,
}: {
  code: string;
}): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<void>(`/me/verify`, {
      code,
    }),
  );
}
