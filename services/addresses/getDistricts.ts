"use server";

import type { DistrictDto } from "@/lib/interfaces/address";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /addresses/districts?provinceId= */
export async function getDistricts(
  provinceId: number,
): Promise<APIResponse<DistrictDto[]>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<DistrictDto[]>("/addresses/districts", {
      params: { provinceId },
    }),
  );
}
