import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1) || "/";
  }
  return pathname;
}

function base64UrlToJson(segment: string): { exp?: number } | null {
  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
    const decoded = typeof atob !== "undefined" ? atob(padded) : "";
    const data = JSON.parse(decoded) as { exp?: number };
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

function isJwtLikelyExpired(token: string): boolean {
  const parts = token.split(".");
  const payloadSeg = parts[1];
  if (!payloadSeg) return true;
  const payload = base64UrlToJson(payloadSeg);
  const exp = payload?.exp;
  if (typeof exp !== "number") return false;
  return Date.now() / 1000 >= exp - 15;
}

function clearCookie(res: NextResponse) {
  res.cookies.set(AUTH_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);
  let token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let tokenStale = false;
  if (token && isJwtLikelyExpired(token)) {
    tokenStale = true;
    token = undefined;
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = token ? "/dashboard" : "/login";
    url.search = "";
    const res = NextResponse.redirect(url);
    if (tokenStale) clearCookie(res);
    return res;
  }

  if (pathname === "/login") {
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      const res = NextResponse.redirect(url);
      if (tokenStale) clearCookie(res);
      return res;
    }
    const res = NextResponse.next();
    if (tokenStale) clearCookie(res);
    return res;
  }

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    const res = NextResponse.redirect(url);
    if (tokenStale) clearCookie(res);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|.*\\.[\\w-]+$).*)",
  ],
};
