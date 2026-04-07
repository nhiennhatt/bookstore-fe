"use server";

import serverAxios from "@/lib/server/serverAxios";

export async function checkSlugExistence(
  slug: string,
): Promise<{ result: boolean }> {
  const response = await serverAxios.get<{ result: boolean }>(
    `/categories/slug/${encodeURIComponent(slug)}/valid`,
  );

  return response.data;
}

