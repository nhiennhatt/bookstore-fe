"use server";

import { v4 } from "uuid";
import { cookies } from "next/headers";

export default async function generateConnection() {
  const cookieStore = await cookies();
  if (!cookieStore.get("connectionString")) {
    cookieStore.set("connectionString", v4(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
}
