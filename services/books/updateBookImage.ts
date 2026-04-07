"use server";

import { revalidatePath } from "next/cache";

import serverAxios from "@/lib/server/serverAxios";

export async function updateBookImage(
  bookId: string,
  formData: FormData,
): Promise<{ result: string } | null> {
  const { data } = await serverAxios.put<{ result: string } | undefined>(
    `/books/${bookId}/image`,
    formData,
    {
      transformRequest: [
        (body, headers) => {
          if (body instanceof FormData) {
            delete headers["Content-Type"];
          }
          return body;
        },
      ],
    },
  );
  revalidatePath(`/management/books/${bookId}`);
  revalidatePath("/management/books");
  return data ?? null;
}
