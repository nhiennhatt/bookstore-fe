"use server";

import type { ProvinceDto } from "@/lib/interfaces/address";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /addresses/provinces */
export async function getProvinces(): Promise<APIResponse<ProvinceDto[]>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<ProvinceDto[]>("/addresses/provinces"),
  );
}
