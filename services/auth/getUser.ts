"use server";
import { cookies } from "next/headers";
import { User } from "@/lib/interfaces/user";
import serverAxios from "@/lib/server/serverAxios";

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return null;
  }

  const response = await serverAxios.get<User>("/me");
  return response.data;
}
