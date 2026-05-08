"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { CollectionBook } from "@/lib/interfaces/collection-book";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /collections/{id}/books — body: CreateCollectionBookValidation */
export async function addBookToCollection(
  collectionId: string,
  bookId: string,
): Promise<APIResponse<CollectionBook>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<CollectionBook>(`/collections/${collectionId}/books`, {
      bookId,
    }),
  );
}
