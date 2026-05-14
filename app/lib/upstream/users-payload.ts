import type { UpstreamUserListItem } from "@/lib/users/types";

/** Parses `{ users, total }` list payloads from the configured upstream user API. */
export function parseUsersListEnvelope(
  data: unknown
): { users: UpstreamUserListItem[]; total: number } | null {
  if (typeof data !== "object" || data === null) return null;
  const o = data as Record<string, unknown>;
  if (!Array.isArray(o.users) || typeof o.total !== "number") return null;
  return {
    users: o.users.filter(isUserListShape) as UpstreamUserListItem[],
    total: o.total,
  };
}

function isUserListShape(x: unknown): boolean {
  if (typeof x !== "object" || x === null) return false;
  const u = x as Record<string, unknown>;
  return (
    typeof u.id === "number" &&
    typeof u.email === "string" &&
    typeof u.firstName === "string" &&
    typeof u.lastName === "string" &&
    typeof u.role === "string"
  );
}
