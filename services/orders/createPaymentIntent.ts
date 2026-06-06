"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { CreatePaymentIntentDto } from "@/lib/interfaces/order";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /orders/:id/payment-intent */
export async function createPaymentIntent(
  orderId: string,
): Promise<APIResponse<CreatePaymentIntentDto>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<CreatePaymentIntentDto>(
      `/orders/${orderId}/payment-intent`,
    ),
  );
}
