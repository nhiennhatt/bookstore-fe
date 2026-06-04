"use server";
import { APIResponse } from "@/lib/interfaces/common";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";
import serverSecurityAxios from "@/lib/server/serverAxios";

export async function commitOrderToShipping(
  id: string,
): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post(`/orders/${id}/shipping-commit`),
  );
}
