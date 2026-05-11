import type { UpstreamProduct } from "@/lib/products/types";
import type { UpstreamUserListItem } from "@/lib/users/types";

export function djUsersEnvelope(
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

export function djProductsEnvelope(
  data: unknown
): { products: UpstreamProduct[]; total: number } | null {
  if (typeof data !== "object" || data === null) return null;
  const o = data as Record<string, unknown>;
  if (!Array.isArray(o.products) || typeof o.total !== "number") return null;
  return {
    products: o.products.filter(isProductShape) as UpstreamProduct[],
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

function isProductShape(x: unknown): boolean {
  if (typeof x !== "object" || x === null) return false;
  const p = x as Record<string, unknown>;
  return (
    typeof p.id === "number" &&
    typeof p.title === "string" &&
    typeof p.description === "string" &&
    typeof p.category === "string" &&
    typeof p.price === "number"
  );
}
