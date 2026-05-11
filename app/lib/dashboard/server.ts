import {
  httpErrPublicMessage,
  isHttpOk,
  responseToJsonResult,
  type HttpResult,
} from "@/lib/http-result";
import type { UpstreamPost } from "@/lib/posts/types";
import type { UpstreamUserListItem } from "@/lib/users/types";
import { upstreamFetch } from "@/lib/server-upstream";

function mapUpstreamUser(u: UpstreamUserListItem) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.id % 2 === 0 ? ("admin" as const) : ("user" as const),
    status: u.id % 3 === 0 ? ("inactive" as const) : ("active" as const),
  };
}

async function fetchUserPage500(): Promise<
  HttpResult<{ users: UpstreamUserListItem[]; total: number }>
> {
  const params = new URLSearchParams({
    _page: "1",
    _limit: "500",
  });
  let res: Response;
  try {
    res = await upstreamFetch(`users?${params.toString()}`, {
      next: { revalidate: 60 },
    });
  } catch (e: unknown) {
    return {
      ok: false,
      kind: "network",
      message: e instanceof Error ? e.message : "Network error.",
    };
  }
  const json = await responseToJsonResult<UpstreamUserListItem[]>(res);
  if (!isHttpOk(json)) {
    return json;
  }
  const headerTotal = Number(res.headers.get("x-total-count"));
  const rows = json.data;
  const total =
    Number.isFinite(headerTotal) && headerTotal > 0
      ? headerTotal
      : rows.length;
  return { ok: true, status: res.status, data: { users: rows, total } };
}

async function fetchRecentPosts(): Promise<HttpResult<UpstreamPost[]>> {
  const params = new URLSearchParams({
    _sort: "id",
    _order: "desc",
    _limit: "8",
  });
  let res: Response;
  try {
    res = await upstreamFetch(`posts?${params.toString()}`, {
      next: { revalidate: 60 },
    });
  } catch (e: unknown) {
    return {
      ok: false,
      kind: "network",
      message: e instanceof Error ? e.message : "Network error.",
    };
  }
  return responseToJsonResult<UpstreamPost[]>(res);
}

export type DashboardActivityItem = {
  id: string;
  label: string;
  href: string;
};

export type DashboardSnapshot = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  activities: DashboardActivityItem[];
};

function scaledMetric(
  sampleCount: number,
  sampleLen: number,
  catalogTotal: number
): number {
  if (sampleLen === 0) return 0;
  if (sampleLen >= catalogTotal) return sampleCount;
  return Math.round((sampleCount / sampleLen) * catalogTotal);
}

function buildActivities(
  users: ReturnType<typeof mapUpstreamUser>[],
  posts: UpstreamPost[]
): DashboardActivityItem[] {
  const byId = new Map(users.map((u) => [u.id, u] as const));
  const items: DashboardActivityItem[] = [];

  for (const p of posts.slice(0, 4)) {
    const author = byId.get(p.userId);
    const who = author?.name ?? `User #${p.userId}`;
    const short =
      p.title.length > 52 ? `${p.title.slice(0, 50)}…` : p.title;
    items.push({
      id: `post-${p.id}`,
      label: `${who} published “${short}”.`,
      href: `/posts/${p.id}`,
    });
  }

  const recentUsers = [...users].sort((a, b) => b.id - a.id).slice(0, 5);
  for (const u of recentUsers) {
    items.push({
      id: `user-${u.id}`,
      label: `${u.name} was added to the directory.`,
      href: `/users/${u.id}`,
    });
  }

  return items.slice(0, 8);
}

export async function fetchDashboardSnapshot(): Promise<
  | { ok: true; data: DashboardSnapshot }
  | { ok: false; message: string }
> {
  const [usersR, postsR] = await Promise.all([
    fetchUserPage500(),
    fetchRecentPosts(),
  ]);

  if (!isHttpOk(usersR)) {
    return { ok: false, message: httpErrPublicMessage(usersR) };
  }
  if (!isHttpOk(postsR)) {
    return { ok: false, message: httpErrPublicMessage(postsR) };
  }

  const { users: raw, total: catalogTotal } = usersR.data;
  const mapped = raw.map(mapUpstreamUser);
  const activeInSample = mapped.filter((u) => u.status === "active").length;
  const inactiveInSample = mapped.length - activeInSample;
  const activeUsers = scaledMetric(
    activeInSample,
    mapped.length,
    catalogTotal
  );
  const inactiveUsers = scaledMetric(
    inactiveInSample,
    mapped.length,
    catalogTotal
  );

  return {
    ok: true,
    data: {
      totalUsers: catalogTotal,
      activeUsers,
      inactiveUsers,
      activities: buildActivities(mapped, postsR.data),
    },
  };
}
