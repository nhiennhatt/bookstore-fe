"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { PreviewOrderPayload, OrderDto } from "@/lib/interfaces/order";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /orders/preview */
export async function previewOrder(
  payload: PreviewOrderPayload,
): Promise<APIResponse<OrderDto>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<OrderDto>("/orders/preview", payload),
  );
}
