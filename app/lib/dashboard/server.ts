import {
  httpErrPublicMessage,
  isHttpOk,
  type HttpResult,
} from "@/lib/http-result";
import { mapUpstreamListRow } from "@/lib/users/map-row";
import type { UpstreamUserListItem } from "@/lib/users/types";
import {
  directoryDocToListItem,
  listAllDirectoryUsers,
} from "@/lib/users/directory-repository";

async function fetchUsersForDashboard(): Promise<
  HttpResult<{ users: UpstreamUserListItem[]; total: number }>
> {
  try {
    const rows = await listAllDirectoryUsers();
    const users = rows.map((r) => directoryDocToListItem(r.id, r.data));
    return {
      ok: true,
      status: 200,
      data: { users, total: users.length },
    };
  } catch (e: unknown) {
    return {
      ok: false,
      kind: "network",
      message: e instanceof Error ? e.message : "Network error.",
    };
  }
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

  return {
    ok: true,
    data: {
      totalUsers: catalogTotal,
      activeUsers: activeInSample,
      inactiveUsers: inactiveInSample,
      activities: buildActivities(mapped),
    },
  };
}
