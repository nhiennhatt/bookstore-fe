"use server";

import { cookies } from "next/headers";

import axios from "axios";

import { LoginResponse } from "@/lib/interfaces/auth";
import type { APIResponse } from "@/lib/interfaces/common";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: true as const,
  path: "/",
};

export async function login(
  username: string,
  password: string,
): Promise<APIResponse<LoginResponse>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await callAPIWrapper(() =>
    axios.post<LoginResponse>(`${baseUrl}/auth/login`, {
      username,
      password,
    }),
  );

  if (!res.error && res.data) {
    const cookieStore = await cookies();
    cookieStore.set("token", res.data.token, sessionCookieOptions);
    cookieStore.set("refreshToken", res.data.refreshToken, sessionCookieOptions);
  }

  return res;
}
