import { NextResponse } from "next/server";
import {
  checkAdminPassword,
  createSessionToken,
  getAuthCookieOptions,
} from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const password = String(body.password || "");

    if (!checkAdminPassword(password)) {
      return NextResponse.json(
        { ok: false, error: "Неверный пароль" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    const cookie = getAuthCookieOptions(createSessionToken());
    response.cookies.set(cookie.name, cookie.value, cookie);
    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось войти" },
      { status: 500 }
    );
  }
}
