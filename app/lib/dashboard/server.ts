import {
  httpErrPublicMessage,
  isHttpOk,
  responseToJsonResult,
  type HttpResult,
} from "@/lib/http-result";
import type { UpstreamProduct } from "@/lib/products/types";
import { djProductsEnvelope, djUsersEnvelope } from "@/lib/dummy-json/payload";
import { mapUpstreamListRow } from "@/lib/users/map-row";
import type { UpstreamUserListItem } from "@/lib/users/types";
import { upstreamFetch } from "@/lib/server-upstream";

async function fetchUsersAggregated(): Promise<
  HttpResult<{ users: UpstreamUserListItem[]; total: number }>
> {
  let res: Response;
  try {
    res = await upstreamFetch(`users?limit=0&skip=0`, {
      next: { revalidate: 60 },
    });
  } catch (e: unknown) {
    return {
      ok: false,
      kind: "network",
      message: e instanceof Error ? e.message : "Network error.",
    };
  }
  const json = await responseToJsonResult<unknown>(res);
  if (!isHttpOk(json)) {
    return json;
  }
  const env = djUsersEnvelope(json.data);
  if (!env) {
    return {
      ok: false,
      kind: "decode",
      message: "Unexpected users payload.",
    };
  }
  return { ok: true, status: json.status, data: env };
}

async function fetchRecentProducts(): Promise<
  HttpResult<{ products: UpstreamProduct[]; total: number }>
> {
  let res: Response;
  try {
    res = await upstreamFetch(`products?limit=8&skip=0&sortBy=id&order=desc`, {
      next: { revalidate: 60 },
    });
  } catch (e: unknown) {
    return {
      ok: false,
      kind: "network",
      message: e instanceof Error ? e.message : "Network error.",
    };
  }
  const json = await responseToJsonResult<unknown>(res);
  if (!isHttpOk(json)) {
    return json;
  }
  const env = djProductsEnvelope(json.data);
  if (!env) {
    return {
      ok: false,
      kind: "decode",
      message: "Unexpected products payload.",
    };
  }
  return { ok: true, status: json.status, data: env };
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
  users: ReturnType<typeof mapUpstreamListRow>[],
  products: UpstreamProduct[]
): DashboardActivityItem[] {
  const items: DashboardActivityItem[] = [];

  for (const p of products.slice(0, 4)) {
    const short =
      p.title.length > 52 ? `${p.title.slice(0, 50)}…` : p.title;
    items.push({
      id: `product-${p.id}`,
      label: `Product listing: “${short}” (${p.category}).`,
      href: `/products/${p.id}`,
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
  const [usersR, productsR] = await Promise.all([
    fetchUsersAggregated(),
    fetchRecentProducts(),
  ]);

  if (!isHttpOk(usersR)) {
    return { ok: false, message: httpErrPublicMessage(usersR) };
  }
  if (!isHttpOk(productsR)) {
    return { ok: false, message: httpErrPublicMessage(productsR) };
  }

  const { users: raw, total: catalogTotal } = usersR.data;
  const mapped = raw.map(mapUpstreamListRow);
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
      activities: buildActivities(mapped, productsR.data.products),
    },
  };
}
