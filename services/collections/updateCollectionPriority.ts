"use server";

import serverAxios from "@/lib/server/serverAxios";

/** PUT /collections/{id}/priority — body: UpdateCollectionPriorityValidation */
export async function updateCollectionPriority(id: string, priority: number) {
  await serverAxios.put(`/collections/${id}/priority`, {
    priority,
  });
}
