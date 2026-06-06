"use server";

import type {
  CreateAddressPayload,
  UserAddress,
} from "@/lib/interfaces/address";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /me/addresses */
export async function addAddress(
  payload: CreateAddressPayload,
): Promise<APIResponse<UserAddress>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<UserAddress>("/me/addresses", payload),
  );
}
