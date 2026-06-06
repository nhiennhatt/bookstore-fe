"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** PUT /collections/{id}/priority — body: UpdateCollectionPriorityValidation */
export async function updateCollectionPriority(
  id: string,
  priority: number,
): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.put<void>(`/collections/${id}/priority`, {
      priority,
    }),
  );
}
