"use server";

import { Category } from "@/lib/interfaces/category";
import serverAxios from "@/lib/server/serverAxios";

export async function getCategories(): Promise<Category[]> {
  const response = await serverAxios.get<Category[]>("/categories", {
    data: {}
  });
  return response.data;
}