"use server";
import { cookies } from "next/headers";

import { AxiosError } from "axios";
import axios from "axios";

import { LoginResponse } from "@/lib/interfaces/auth";
import { ErrorResponse } from "@/lib/interfaces/common";

export async function login(username: string, password: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.post<LoginResponse>(`${baseUrl}/auth/login`, {
      username,
      password,
    });
    const cookieStore = await cookies();
    cookieStore.set("token", response.data.token, {
      httpOnly: true,
      sameSite: true,
      path: "/",
    });
    cookieStore.set("refreshToken", response.data.refreshToken, {
      httpOnly: true,
      sameSite: true,
      path: "/",
    });
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error(axiosError);
    throw new Error(axiosError.message || "Unknown error");
  }
  return true;
}
