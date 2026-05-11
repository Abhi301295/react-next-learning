import { getUpstreamApiOrigin } from "@/lib/server-upstream";

export function getAuthUpstreamOrigin(): string {
  return getUpstreamApiOrigin().replace(/\/$/, "");
}
