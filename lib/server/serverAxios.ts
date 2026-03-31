import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { LoginResponse } from "../interfaces/auth";
import { ErrorResponse } from "../interfaces/common";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshInFlight = new Map<string, Promise<string>>();

async function performTokenRefresh(refreshToken: string): Promise<string> {
  const { data } = await axios.post<LoginResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/token`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );
  const cookieStore = await cookies();
  cookieStore.set("token", data.token);
  cookieStore.set("refreshToken", data.refreshToken);
  return data.token;
}

async function onRefreshFailure(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("refreshToken");
  revalidatePath("/", "layout");
}

function getSharedRefreshPromise(refreshToken: string): Promise<string> {
  let p = refreshInFlight.get(refreshToken);
  if (p) return p;

  p = performTokenRefresh(refreshToken)
    .catch(async (err) => {
      await onRefreshFailure();
      throw err;
    })
    .finally(() => {
      refreshInFlight.delete(refreshToken);
    });

  refreshInFlight.set(refreshToken, p);
  return p;
}

serverAxios.interceptors.request.use(
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

serverAxios.interceptors.response.use(
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
        return serverAxios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default serverAxios;
