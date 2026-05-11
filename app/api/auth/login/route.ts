import {
  AUTH_COOKIE_NAME,
  SESSION_MAX_AGE_SEC,
} from "@/lib/auth/constants";
import { getAuthUpstreamOrigin } from "@/lib/auth/upstream-origin";
import { NextResponse } from "next/server";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const username =
    typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 }
    );
  }

  const res = await fetch(`${getAuthUpstreamOrigin()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = (await res.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  if (!res.ok || data === null || typeof data.accessToken !== "string") {
    const msg =
      typeof data?.message === "string"
        ? data.message
        : "Invalid username or password.";
    return NextResponse.json({ message: msg }, { status: 401 });
  }

  const accessToken = data.accessToken;
  const user = {
    id: typeof data.id === "number" ? data.id : undefined,
    username: typeof data.username === "string" ? data.username : undefined,
    email: typeof data.email === "string" ? data.email : undefined,
    firstName:
      typeof data.firstName === "string" ? data.firstName : undefined,
    lastName:
      typeof data.lastName === "string" ? data.lastName : undefined,
    image: typeof data.image === "string" ? data.image : undefined,
  };

  const out = NextResponse.json({ user });

  const isProd = process.env.NODE_ENV === "production";

  out.cookies.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });

  return out;
}
