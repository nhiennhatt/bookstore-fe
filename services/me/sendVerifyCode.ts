"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /me/verify-code */
export async function sendVerifyCode(): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<void>(`/me/verify-code`),
  );
}
