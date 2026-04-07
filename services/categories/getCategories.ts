"use server";

import { Category } from "@/lib/interfaces/category";
import serverAxios from "@/lib/server/serverAxios";

/** GET /categories — body: CategoriesFilter (cursor?, keyword?, limit?, isPublic?) */
export async function getCategories({
  cursor,
  keyword,
  limit,
}: {
  cursor?: string | null;
  keyword?: string | null;
  limit?: number;
}): Promise<Category[]> {
  const trimmed = keyword?.trim();
  const response = await serverAxios.get<Category[]>("/categories", {
    data: {
      ...(cursor ? { cursor } : {}),
      ...(trimmed ? { keyword: trimmed } : {}),
      ...(typeof limit === "number" ? { limit } : {}),
    },
  });
  return response.data;
}
