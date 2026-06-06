"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/**
 * Cập nhật thứ tự một mục trong bộ sưu tập (1-based).
 * Backend: PUT /collections/{id}/books/{bookId}
 */
export async function updateCollectionBookPosition(
  collectionId: string,
  bookId: string,
  position: number,
): Promise<APIResponse<void>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.put<void>(
      `/collections/${collectionId}/books/${bookId}`,
      {
        position,
      },
    ),
  );
}
