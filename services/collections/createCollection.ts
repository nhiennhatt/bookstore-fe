"use server";

import type { BookCollection } from "@/lib/interfaces/collection";
import serverAxios from "@/lib/server/serverAxios";

type CreateCollectionPayload = Pick<BookCollection, "name" | "public">;

/** POST /collections/ — body: CreateBookCollectionValidation */
export async function createCollection(
  payload: CreateCollectionPayload,
): Promise<BookCollection> {
  const { data } = await serverAxios.post<BookCollection>("/collections/", payload);
  return data;
}
