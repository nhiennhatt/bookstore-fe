"use server";

import type { Category } from "@/lib/interfaces/category";
import serverAxios from "@/lib/server/serverAxios";

/** POST /categories body: CreateCategoryValidation */
type CreateCategoryResponse = Pick<Category, "id" | "name" | "slug" | "public">;

export async function createCategory(
  payload: Omit<Category, "id">,
): Promise<Category> {
  const { data } = await serverAxios.post<CreateCategoryResponse>(
    "/categories",
    {
      name: payload.name,
      slug: payload.slug,
      public: payload.public,
    },
  );
  return {
    ...data,
    thumbImg: payload.thumbImg ?? "",
  };
}

