"use server";

import type { Category } from "@/lib/interfaces/category";
import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /categories — CreateCategoryValidation → CreateCategoryResponse */
type CreateCategoryResponse = Pick<
  Category,
  "id" | "name" | "slug" | "public" | "featured"
>;
type CreateCategoryInput = Omit<Category, "id">;

export async function createCategory(
  payload: CreateCategoryInput,
): Promise<APIResponse<Category>> {
  const res = await callAPIWrapper(() =>
    serverSecurityAxios.post<CreateCategoryResponse>("/categories", {
      name: payload.name,
      slug: payload.slug,
      public: payload.public,
      featured: payload.featured,
    }),
  );

  if (res.error) {
    return {
      data: undefined as unknown as Category,
      error: res.error,
    };
  }

  const created = res.data;
  return {
    data: {
      ...created,
      thumbImg: payload.thumbImg ?? "",
    },
  };
}
