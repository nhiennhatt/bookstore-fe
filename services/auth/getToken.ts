"use server";

import type { LoginResponse } from "@/lib/interfaces/auth";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverNoSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /auth/token — refresh token */
export async function getToken(
  refreshToken: string,
): Promise<APIResponse<LoginResponse>> {
  return callAPIWrapper(() =>
    serverNoSecurityAxios.post<LoginResponse>("/auth/token", {
      refreshToken,
    }),
  );
}
