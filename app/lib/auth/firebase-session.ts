import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { getAdminAuth } from "@/lib/firebase/admin";
import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = AUTH_COOKIE_NAME;

export async function readSessionCookie(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE_NAME)?.value;
}

export async function verifySessionCookie(): Promise<DecodedIdToken | null> {
  const token = await readSessionCookie();
  if (!token) return null;
  try {
    return await getAdminAuth().verifySessionCookie(token, true);
  } catch {
    return null;
  }
}

export async function createSessionCookieFromIdToken(
  idToken: string,
  expiresInMs: number
): Promise<string> {
  return getAdminAuth().createSessionCookie(idToken, { expiresIn: expiresInMs });
}
