"use server";

import type {
  CreateAddressPayload,
  UserAddress,
} from "@/lib/interfaces/address";
import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** PUT /me/addresses/:id */
export async function updateAddress(
  id: string,
  payload: CreateAddressPayload,
): Promise<APIResponse<UserAddress>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.put<UserAddress>(`/me/addresses/${id}`, payload),
  );
}
