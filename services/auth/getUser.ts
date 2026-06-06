"use server";

import { cookies } from "next/headers";

import type { APIResponse } from "@/lib/interfaces/common";
import { User } from "@/lib/interfaces/user";
import { serverSecurityAxios } from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

export async function getUser(): Promise<APIResponse<User | null>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { data: null };
  }

  return callAPIWrapper(() => serverSecurityAxios.get<User>("/me"));
}
