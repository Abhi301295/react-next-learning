import type { UpstreamUserListItem, User } from "@/lib/users/types";

export function userListDisplayName(u: UpstreamUserListItem): string {
  const joined = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  if (joined) return joined;
  if (typeof u.username === "string" && u.username.trim()) return u.username;
  return `User ${u.id}`;
}

export function mapUpstreamListRow(u: UpstreamUserListItem): User {
  const status =
    u.status === "active" || u.status === "inactive"
      ? u.status
      : "active";
  return {
    id: u.id,
    name: userListDisplayName(u),
    email: u.email,
    role: u.role === "admin" ? "admin" : "user",
    status,
  };
}
