"use server";

import serverAxios from "@/lib/server/serverAxios";

export async function updateCategoryThumb(
  id: string,
  formData: FormData,
): Promise<void> {
  await serverAxios.post(`/categories/${id}/img`, formData, {
    transformRequest: [
      (body, headers) => {
        if (body instanceof FormData) {
          delete headers["Content-Type"];
        }
        return body;
      },
    ],
  });
}

