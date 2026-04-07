"use server";

import serverAxios from "@/lib/server/serverAxios";

export async function updateCategoryInfo(
  id: string,
  payload: {
    name: string;
    slug: string;
    isPublic: boolean;
  },
): Promise<void> {
  await serverAxios.patch(`/categories/${id}`, payload);
}

