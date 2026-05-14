import type { UserListDto } from "@/lib/users/types";

function matchesSearch(item: UserListDto, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [
    item.firstName,
    item.lastName,
    item.email,
    item.username ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

function sortValue(item: UserListDto, sortBy: string): string | number {
  switch (sortBy) {
    case "id":
      return item.id;
    case "firstName":
      return item.firstName.toLowerCase();
    case "email":
      return item.email.toLowerCase();
    case "role":
      return item.role;
    case "status":
      return item.status ?? "active";
    default:
      return item.id;
  }
}

/** Filter, sort, and page an in-memory user list (used after loading from Firestore). */
export function applyUserListQuery(
  items: UserListDto[],
  opts: {
    q?: string;
    sortBy: string;
    order: "asc" | "desc";
    skip: number;
    limit: number;
  }
): { users: UserListDto[]; total: number } {
  const q = opts.q?.trim() ?? "";
  const list = q ? items.filter((u) => matchesSearch(u, q)) : [...items];

  list.sort((a, b) => {
    const av = sortValue(a, opts.sortBy);
    const bv = sortValue(b, opts.sortBy);
    if (typeof av === "number" && typeof bv === "number") {
      return opts.order === "asc" ? av - bv : bv - av;
    }
    const c = String(av).localeCompare(String(bv));
    return opts.order === "asc" ? c : -c;
  });

  const total = list.length;
  const skip = Math.max(0, opts.skip);
  const lim = opts.limit <= 0 ? total : opts.limit;
  const page = list.slice(skip, skip + lim);
  return { users: page, total };
}
