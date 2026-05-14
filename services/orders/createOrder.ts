"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { CreateOrderPayload, Order } from "@/lib/interfaces/order";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /orders */
export async function createOrder(
  payload: CreateOrderPayload,
): Promise<APIResponse<Order>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<Order>("/orders", payload),
  );
}
