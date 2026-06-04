"use server";
import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /orders/{id}/done-commit */
export async function commitOrderToDone(id: string): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post(`/orders/${id}/done-commit`),
  );
}
