"use server";

import { revalidatePath } from "next/cache";

import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** PUT /variants/:id/image — StringDto */
export async function updateVariantImage(
  variantId: string,
  bookId: string,
  formData: FormData,
): Promise<APIResponse<{ result: string }>> {
  const res = await callAPIWrapper(() =>
    serverSecurityAxios.put<{ result: string }>(
      `/variants/${variantId}/image`,
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
    ),
  );
  if (!res.error) {
    revalidatePath(`/management/books/${bookId}`);
    revalidatePath("/management/books");
  }
  return res;
}
