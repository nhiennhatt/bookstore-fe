"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "jose";

import axios from "axios";
import { getToken } from "@/services/auth/getToken";
const connectionLocks = new Map<string, Promise<string>>();

const serverSecurityAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const serverNoSecurityAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getValidToken(connectionString: string): Promise<string> {
  const existingLock = connectionLocks.get(connectionString);
  if (existingLock) return existingLock;

  const userCookies = await cookies();
  const token = userCookies.get("accessToken")?.value;
  if (!token || isTokenExpiredInMinutes(token, 5)) {
    const refreshToken = userCookies.get("refreshToken")?.value;
    if (!refreshToken) throw new Error("No refresh token found");
    const res = await getToken(refreshToken);
    if (res.error || !res.data) throw new Error(res.error?.errorCode);
    userCookies.set("accessToken", res.data.token, {
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    });

    userCookies.set("refreshToken", res.data.refreshToken, {
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    });
    connectionLocks.delete(connectionString);
    return res.data.token;
  } else {
    return token;
  }
}

function isTokenExpiredInMinutes(token: string, minutes: number): boolean {
  try {
    const decoded = decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (!decoded.exp) return true;
    return decoded.exp < currentTime + minutes * 60;
  } catch (error) {
    console.error(error);
    return true;
  }
}

serverSecurityAxios.interceptors.request.use(async (config) => {
  const userCookies = await cookies();
  const connectionString = userCookies.get("connectionString");
  if (!connectionString) throw new Error("No connection string found");
  const token = await getValidToken(connectionString.value);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { serverSecurityAxios, serverNoSecurityAxios };
