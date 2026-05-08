"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { LoginResponse } from "../interfaces/auth";
import { ErrorResponse } from "../interfaces/common";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const serverSecurityAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const serverNoSecurityAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshInFlight = new Map<string, Promise<string>>();

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: true as const,
  path: "/",
};

async function performTokenRefresh(refreshToken: string): Promise<string> {
  const { data } = await axios.post<LoginResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/token`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );
  try {
    const cookieStore = await cookies();
    cookieStore.set("token", data.token, sessionCookieOptions);
    cookieStore.set("refreshToken", data.refreshToken, sessionCookieOptions);
  } catch {
    // Chỉ Server Action / Route Handler được ghi cookie. Gọi serverAxios từ RSC
    // hoặc chuỗi khác có thể refresh token nhưng không được set cookie — vẫn trả
    // token để retry request hiện tại thành công.
  }
  return data.token;
}

async function onRefreshFailure(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("refreshToken");
    revalidatePath("/", "layout");
  } catch {
    // Chỉ Server Action / Route Handler được ghi cookie. Gọi serverAxios từ RSC
    // hoặc chuỗi khác có thể refresh token nhưng không được set cookie — vẫn trả
    // token để retry request hiện tại thành công.
  }
}

function getSharedRefreshPromise(refreshToken: string): Promise<string> {
  let p = refreshInFlight.get(refreshToken);
  if (p) return p;

  p = performTokenRefresh(refreshToken)
    .catch(async (err) => {
      console.error(err);
      await onRefreshFailure();
      throw err;
    })
    .finally(() => {
      refreshInFlight.delete(refreshToken);
    });

  refreshInFlight.set(refreshToken, p);
  return p;
}

serverSecurityAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

serverSecurityAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (
      error.response?.status === 401 &&
      error.response?.data?.errorCode === "TOKEN_EXPIRED" &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refreshToken")?.value;
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const newToken = await getSharedRefreshPromise(refreshToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return serverSecurityAxios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default serverSecurityAxios;
