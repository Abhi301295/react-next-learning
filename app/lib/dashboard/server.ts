import { unstable_noStore } from "next/cache";
import { messages } from "@/lib/constants/messages";
import {
  httpErrPublicMessage,
  isHttpOk,
  type HttpResult,
} from "@/lib/http-result";
import { mapUserListDtoToRow } from "@/lib/users/map-row";
import type { UserListDto } from "@/lib/users/types";
import {
  listAllUserRecords,
  userRecordToListDto,
} from "@/lib/users/user-repository";

async function fetchUsersForDashboard(): Promise<
  HttpResult<{ users: UserListDto[]; total: number }>
> {
  try {
    const rows = await listAllUserRecords();
    const users = rows.map((r) => userRecordToListDto(r.id, r.data));
    return {
      ok: true,
      status: 200,
      data: { users, total: users.length },
    };
  } catch (e: unknown) {
    return {
      ok: false,
      kind: "network",
      message:
        e instanceof Error ? e.message : messages.users.listLoadFailed,
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
  users: ReturnType<typeof mapUserListDtoToRow>[]
): DashboardActivityItem[] {
  return users.slice(0, 8).map((u) => ({
    id: `user-${u.id}`,
    label: `${u.name} joined (${u.role}, ${u.status}).`,
    href: `/users/${u.id}`,
  }));
}

export async function fetchDashboardSnapshot(): Promise<
  | { ok: true; data: DashboardSnapshot }
  | { ok: false; message: string }
> {
  unstable_noStore();
  const usersR = await fetchUsersForDashboard();

  if (!isHttpOk(usersR)) {
    return { ok: false, message: httpErrPublicMessage(usersR) };
  }

  const { users: raw, total: catalogTotal } = usersR.data;
  const mapped = raw.map(mapUserListDtoToRow);
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
