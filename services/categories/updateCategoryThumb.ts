"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** POST /categories/:id/img — uploadCategoryImage */
export async function updateCategoryThumb(
  id: string,
  formData: FormData,
): Promise<APIResponse<Record<string, string>>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.post<Record<string, string>>(
      `/categories/${id}/img`,
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
}
