"use server";

import type { UserAddress } from "@/lib/interfaces/address";
import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /me/addresses */
export async function getAddresses(): Promise<APIResponse<UserAddress[]>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<UserAddress[]>("/me/addresses"),
  );
}
