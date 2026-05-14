"use server";

import type {
  CreateUserPayload,
  CreateUserResponse,
} from "@/lib/interfaces/auth";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverNoSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /auth/register */
export async function register(
  payload: CreateUserPayload,
): Promise<APIResponse<CreateUserResponse>> {
  return callAPIWrapper(() =>
    serverNoSecurityAxios.post<CreateUserResponse>(
      "/auth/register",
      payload,
    ),
  );
}
