import { NextResponse } from "next/server";
import { getClearAuthCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const cookie = getClearAuthCookieOptions();
  response.cookies.set(cookie.name, cookie.value, cookie);
  return response;
}
