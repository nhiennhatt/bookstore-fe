"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { OrderOverviewDto } from "@/lib/interfaces/order";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /me/orders */
export async function getMyOrders(): Promise<APIResponse<OrderOverviewDto[]>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<OrderOverviewDto[]>("/me/orders"),
  );
}
