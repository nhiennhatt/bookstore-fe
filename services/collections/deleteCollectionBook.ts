"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** DELETE /collections/{id}/books/{bookId} */
export async function deleteCollectionBook(
  id: string,
  bookId: string,
): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.delete<void>(`/collections/${id}/books/${bookId}`),
  );
}
