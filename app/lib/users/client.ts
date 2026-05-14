import { isHttpOk, runAppApiJson } from "@/lib/app-api";
import { parseUserListResponse } from "@/lib/users/list-response";
import type { HttpResult } from "@/lib/http-result";
import { messages } from "@/lib/constants/messages";
import type { UserListDto } from "./types";

export async function fetchUserList(
  opts: {
    limit: number;
    skip?: number;
    search?: string;
    sortBy: string;
    order: "asc" | "desc";
  },
  signal?: AbortSignal
): Promise<HttpResult<{ users: UserListDto[]; total: number }>> {
  const skip = Math.max(0, opts.skip ?? 0);
  const qs = new URLSearchParams();
  qs.set("limit", opts.limit <= 0 ? "0" : String(opts.limit));
  qs.set("skip", String(skip));
  qs.set("sortBy", opts.sortBy);
  qs.set("order", opts.order);
  if (opts.search?.trim()) {
    qs.set("q", opts.search.trim());
  }
  const pathBase = `users?${qs.toString()}`;

  const json = await runAppApiJson<unknown>(pathBase, { signal });
  if (!isHttpOk(json)) return json;

  const env = parseUserListResponse(json.data);
  if (!env) {
    return {
      ok: false,
      kind: "decode",
      message: messages.users.unexpectedListShape,
    };
  }
  return {
    ok: true,
    status: json.status,
    data: env,
  };
}
