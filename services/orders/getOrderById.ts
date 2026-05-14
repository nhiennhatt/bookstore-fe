"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { OrderDto } from "@/lib/interfaces/order";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /orders/:id */
export async function getOrderById(
  id: string,
): Promise<APIResponse<OrderDto>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<OrderDto>(`/orders/${id}`),
  );
}
