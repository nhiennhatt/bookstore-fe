"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { BookCollection } from "@/lib/interfaces/collection";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

type CreateCollectionPayload = Pick<BookCollection, "name" | "public">;

/** POST /collections/ — body: CreateBookCollectionValidation */
export async function createCollection(
  payload: CreateCollectionPayload,
): Promise<APIResponse<BookCollection>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<BookCollection>("/collections/", payload),
  );
}
