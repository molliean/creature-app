"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn() {
  const cookieStore = await cookies();
  cookieStore.set("creature_auth", "1", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  redirect("/home");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("creature_auth");
  redirect("/");
}
