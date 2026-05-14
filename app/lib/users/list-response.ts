import type { UserListDto } from "@/lib/users/types";

/** Parses `{ users, total }` from `GET /api/users`. */
export function parseUserListResponse(
  data: unknown
): { users: UserListDto[]; total: number } | null {
  if (typeof data !== "object" || data === null) return null;
  const o = data as Record<string, unknown>;
  if (!Array.isArray(o.users) || typeof o.total !== "number") return null;
  return {
    users: o.users
      .filter(isUserListShape)
      .map((u) => normalizeListItem(u)) as UserListDto[],
    total: o.total,
  };
}

function normalizeListItem(x: unknown): UserListDto {
  const u = x as Record<string, unknown>;
  const id =
    typeof u.id === "number" && Number.isFinite(u.id)
      ? String(Math.trunc(u.id))
      : String(u.id ?? "");
  return {
    id,
    firstName: String(u.firstName ?? ""),
    lastName: String(u.lastName ?? ""),
    email: String(u.email ?? ""),
    role: String(u.role ?? "user"),
    username: typeof u.username === "string" ? u.username : undefined,
    status:
      u.status === "active" || u.status === "inactive"
        ? u.status
        : undefined,
  };
}

function isUserListShape(x: unknown): boolean {
  if (typeof x !== "object" || x === null) return false;
  const u = x as Record<string, unknown>;
  const idOk =
    (typeof u.id === "string" && u.id.length > 0) ||
    (typeof u.id === "number" && Number.isFinite(u.id));
  return (
    idOk &&
    typeof u.email === "string" &&
    typeof u.firstName === "string" &&
    typeof u.lastName === "string" &&
    typeof u.role === "string"
  );
}
