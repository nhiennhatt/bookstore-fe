"use server";

import type { BookVariant } from "@/lib/interfaces/bookVariant";
import type { APIResponse } from "@/lib/interfaces/common";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /variants/:id */
export async function getBookVariant(
  id: string,
): Promise<APIResponse<BookVariant>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<BookVariant>(`/variants/${id}`),
  );
}
