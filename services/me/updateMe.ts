"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { UpdateUserPayload, User } from "@/lib/interfaces/user";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** PUT /me */
export async function updateMe(
  payload: UpdateUserPayload,
): Promise<APIResponse<User>> {
  return callAPIWrapper(() => serverSecurityAxios.put<User>("/me", payload));
}
