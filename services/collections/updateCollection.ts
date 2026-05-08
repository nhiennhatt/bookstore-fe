"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

type UpdateCollectionPayload = {
  name: string;
  public: boolean;
};

/** PUT /collections/{id} — body: UpdateBookCollectionValidation */
export async function updateCollection(
  id: string,
  payload: UpdateCollectionPayload,
): Promise<APIResponse<void>> {
  return callAPIWrapper(() => serverSecurityAxios.put<void>(`/collections/${id}`, payload));
}
