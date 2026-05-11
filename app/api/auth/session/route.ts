import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { getAuthUpstreamOrigin } from "@/lib/auth/upstream-origin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(`${getAuthUpstreamOrigin()}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const out = NextResponse.json({ user: null }, { status: 401 });
    const isProd = process.env.NODE_ENV === "production";
    out.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return out;
  }

  type Me = Record<string, unknown>;
  const data = (await res.json()) as Me;

  const user = {
    id: typeof data.id === "number" ? data.id : undefined,
    username:
      typeof data.username === "string" ? data.username : undefined,
    email: typeof data.email === "string" ? data.email : undefined,
    firstName:
      typeof data.firstName === "string" ? data.firstName : undefined,
    lastName:
      typeof data.lastName === "string" ? data.lastName : undefined,
    image: typeof data.image === "string" ? data.image : undefined,
  };

  return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
}
