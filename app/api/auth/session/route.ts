import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionCookie } from "@/lib/auth/firebase-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const decoded = await verifySessionCookie();
  if (!decoded) {
    const jar = await cookies();
    const isProd = process.env.NODE_ENV === "production";
    if (jar.get(AUTH_COOKIE_NAME)?.value) {
      const out = NextResponse.json({ user: null }, { status: 401 });
      out.cookies.set(AUTH_COOKIE_NAME, "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return out;
    }
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = {
    id: decoded.uid,
    username: decoded.email ?? undefined,
    email: typeof decoded.email === "string" ? decoded.email : undefined,
    firstName:
      typeof decoded.name === "string"
        ? decoded.name.split(/\s+/)[0]
        : undefined,
    lastName:
      typeof decoded.name === "string"
        ? decoded.name.split(/\s+/).slice(1).join(" ") || undefined
        : undefined,
    image: typeof decoded.picture === "string" ? decoded.picture : undefined,
  };

  return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
}
