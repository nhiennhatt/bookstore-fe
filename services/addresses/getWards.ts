"use server";

import type { WardDto } from "@/lib/interfaces/address";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /addresses/wards?districtId= */
export async function getWards(
  districtId: number,
): Promise<APIResponse<WardDto[]>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<WardDto[]>("/addresses/wards", {
      params: { districtId },
    }),
  );
}
