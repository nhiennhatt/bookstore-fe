"use server";

import type { Book } from "@/lib/interfaces/book";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

type CreateBookPayload = Pick<
  Book,
  | "name"
  | "author"
  | "description"
  | "publisher"
  | "distributor"
  | "slug"
  | "status"
> & {
  categoryId?: string;
};

export async function createBook(
  payload: CreateBookPayload,
): Promise<APIResponse<Book>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<Book>("/books", payload),
  );
}
