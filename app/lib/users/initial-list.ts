/**
 * Server-side first page of `/users` for RSC → `useUsers(initial)`.
 * Uses limit 5, `sortBy=firstName`, `order=asc` — must match the client’s first `load()`
 * (`useUsers` defaults + `USER_SORT_API`). @see root README — "How the `/users` list works (maintainers)"
 */

import { djUsersEnvelope } from "@/lib/dummy-json/payload";
import { isHttpOk, responseToJsonResult } from "@/lib/http-result";
import { upstreamFetch } from "@/lib/server-upstream";
import { mapUpstreamListRow } from "./map-row";
import type { User } from "./types";

const INITIAL_LIMIT = 5;

export async function fetchUsersListInitialForPage(): Promise<{
  users: User[];
  total: number;
} | null> {
  try {
    const res = await upstreamFetch(
      `users?limit=${INITIAL_LIMIT}&skip=0&sortBy=firstName&order=asc`,
      { next: { revalidate: 30 } }
    );
    const json = await responseToJsonResult<unknown>(res);
    if (!isHttpOk(json)) return null;
    const env = djUsersEnvelope(json.data);
    if (!env) return null;
    const mapped = env.users.map(mapUpstreamListRow);
    return {
      users: mapped.slice(0, INITIAL_LIMIT),
      total: env.total,
    };
  } catch {
    return null;
  }
}
