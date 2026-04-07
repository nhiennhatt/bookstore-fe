"use server";

import serverAxios from "@/lib/server/serverAxios";

export async function deleteCategory(id: string): Promise<void> {
  await serverAxios.delete(`/categories/${id}`);
}

