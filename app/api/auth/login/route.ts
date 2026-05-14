import {
  AUTH_COOKIE_NAME,
  SESSION_MAX_AGE_SEC,
} from "@/lib/auth/constants";
import { messages } from "@/lib/constants/messages";
import { createSessionCookieFromIdToken } from "@/lib/auth/firebase-session";
import { NextResponse } from "next/server";

type LoginBody = {
  idToken?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { message: messages.api.invalidJsonBody },
      { status: 400 }
    );
  }

  const idToken = typeof body.idToken === "string" ? body.idToken.trim() : "";
  if (!idToken) {
    return NextResponse.json(
      { message: messages.api.missingAuthToken },
      { status: 400 }
    );
  }

  try {
    const expiresInMs = SESSION_MAX_AGE_SEC * 1000;
    const sessionCookie = await createSessionCookieFromIdToken(
      idToken,
      expiresInMs
    );

    const out = NextResponse.json({ ok: true });

    const isProd = process.env.NODE_ENV === "production";
    out.cookies.set(AUTH_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SEC,
    });

    return out;
  } catch (e: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[api/auth/login] createSessionCookie failed:", e);
    }
    const detail =
      process.env.NODE_ENV === "development" && e instanceof Error
        ? e.message
        : messages.api.signInInvalidOrExpired;
    return NextResponse.json({ message: detail }, { status: 401 });
  }
}
