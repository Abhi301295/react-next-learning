import {
  httpErrPublicMessage,
  isHttpOk,
  responseToJsonResult,
  type HttpResult,
} from "@/lib/http-result";
import { djUsersEnvelope } from "@/lib/dummy-json/payload";
import { mapUpstreamListRow } from "@/lib/users/map-row";
import type { UpstreamUserListItem } from "@/lib/users/types";
import { upstreamFetch } from "@/lib/server-upstream";

async function fetchUsersForDashboard(): Promise<
  HttpResult<{ users: UpstreamUserListItem[]; total: number }>
> {
  let res: Response;
  try {
    res = await upstreamFetch(
      "users?limit=100&skip=0&sortBy=id&order=desc",
      {
        next: { revalidate: 60 },
      }
    );
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
  users: ReturnType<typeof mapUpstreamListRow>[]
): DashboardActivityItem[] {
  return users.slice(0, 8).map((u) => ({
    id: `user-${u.id}`,
    label: `${u.name} joined the directory (${u.role}, ${u.status}).`,
    href: `/users/${u.id}`,
  }));
}

export async function fetchDashboardSnapshot(): Promise<
  | { ok: true; data: DashboardSnapshot }
  | { ok: false; message: string }
> {
  const usersR = await fetchUsersForDashboard();

  if (!isHttpOk(usersR)) {
    return { ok: false, message: httpErrPublicMessage(usersR) };
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
      activities: buildActivities(mapped),
    },
  };
}
