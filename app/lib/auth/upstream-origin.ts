import { getUpstreamApiOrigin } from "@/lib/server-upstream";

/** Base origin for auth requests (matches `API_BASE_URL`, no trailing slash). */
export function getAuthUpstreamOrigin(): string {
  return getUpstreamApiOrigin().replace(/\/$/, "");
}
