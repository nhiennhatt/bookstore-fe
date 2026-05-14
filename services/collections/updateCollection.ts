"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { BookCollection } from "@/lib/interfaces/collection";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

type UpdateCollectionPayload = {
  name: string;
  public?: boolean;
};

/** PUT /collections/{id} — body: UpdateBookCollectionValidation */
export async function updateCollection(
  id: string,
  payload: UpdateCollectionPayload,
): Promise<APIResponse<BookCollection>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.put<BookCollection>(`/collections/${id}`, payload),
  );
}
