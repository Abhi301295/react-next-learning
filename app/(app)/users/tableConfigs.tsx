"use client";

import Link from "next/link";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import type { ListConfig } from "@/components/shared/list/List";
import TableFilterField from "@/components/shared/table/filters/TableFilterField";
import type { TableConfig } from "@/components/shared/table/core/ConfigurableTable";
import { Button } from "@/components/ui/Button";
import type { Column } from "@/components/shared/table/core/Table";
import type { User } from "@/lib/users/types";
import { useRouter } from "next/navigation";

export const EMPTY_USERS_TITLE = "No users found";
export const EMPTY_USERS_DESCRIPTION = "Try again or check your API configuration.";

export type UsersFilterKey = "role" | "status";

export const USER_COLUMNS: readonly Column<User, keyof User>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

export const usersFilterDefinitions = [
  {
    key: "role" as UsersFilterKey,
    initialValue: "all",
    predicate: (user: User, value: string | boolean | string[]) =>
      value === "all" ? true : user.role === value,
  },
  {
    key: "status" as UsersFilterKey,
    initialValue: "all",
    predicate: (user: User, value: string | boolean | string[]) =>
      value === "all" ? true : user.status === value,
  },
];

const renderUsersFilterFields = (
  values: Record<UsersFilterKey, string | boolean | string[]>,
  setValue: (key: UsersFilterKey, value: string | boolean | string[]) => void
) => (
  <div className="space-y-3">
    <TableFilterField
      label="Role"
      value={values.role}
      onChange={(value) => setValue("role", value)}
      options={[
        { label: "All roles", value: "all" },
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ]}
    />
    <TableFilterField
      label="Status"
      value={values.status}
      onChange={(value) => setValue("status", value)}
      options={[
        { label: "All statuses", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ]}
    />
  </div>
);

function UserViewActionButton({ user }: { user: User }) {
  const router = useRouter();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      iconOnly
      icon="👁"
      aria-label={`View profile for ${user.name}`}
      tooltip={`View ${user.name}`}
      onClick={() => router.push(`/users/${user.id}`)}
    />
  );
}

export const usersDesktopTableConfig: Omit<
  TableConfig<User, UsersFilterKey>,
  "columns" | "getKey"
> = {
  rowActionsLabel: "Actions",
  rowActions: (user) => <UserViewActionButton user={user} />,
  search: {
    enabled: true,
    label: "Search users",
    placeholder: "Search by name, email, role, or status",
    fields: ["name", "email", "role", "status"],
  },
  filters: {
    enabled: true,
    mode: "panel",
    title: "Filter users",
    triggerLabel: "Filters",
    definitions: usersFilterDefinitions,
    template: ({ values, setValue }) => renderUsersFilterFields(values, setValue),
  },
  sorting: {
    enabled: true,
    initialSortKey: "name",
    initialSortDirection: "asc",
  },
  pagination: {
    enabled: true,
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 20],
  },
  emptyState: {
    noDataTitle: EMPTY_USERS_TITLE,
    noDataDescription: EMPTY_USERS_DESCRIPTION,
  },
};

export const usersMobileStateConfig = {
  emptyComponent: (
    <EmptyState title={EMPTY_USERS_TITLE} description={EMPTY_USERS_DESCRIPTION} />
  ),
};

export const usersPaginatedDesktopBase: Omit<
  TableConfig<User, UsersFilterKey>,
  "columns" | "getKey" | "server"
> = {
  rowActionsLabel: "Actions",
  rowActions: (user) => <UserViewActionButton user={user} />,
  search: {
    enabled: true,
    label: "Search users",
    placeholder: "Search by name, email, or id",
    fields: ["name", "email", "id"],
  },
  filters: {
    enabled: true,
    mode: "panel",
    title: "Filter users",
    triggerLabel: "Filters",
    definitions: usersFilterDefinitions,
    template: ({ values, setValue }) => renderUsersFilterFields(values, setValue),
  },
  sorting: {
    enabled: true,
    initialSortKey: "name",
    initialSortDirection: "asc",
  },
  pagination: {
    enabled: true,
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 20],
  },
  emptyState: {
    noDataTitle: EMPTY_USERS_TITLE,
    noDataDescription: EMPTY_USERS_DESCRIPTION,
  },
};

export const usersPaginatedMobileListBase: Omit<
  ListConfig<User, UsersFilterKey>,
  "server"
> = {
  search: {
    enabled: true,
    label: "Search users",
    placeholder: "Search by name, email, or id",
    fields: ["name", "email", "id"],
  },
  filters: {
    enabled: true,
    title: "Filter users",
    triggerLabel: "Filters",
    definitions: usersFilterDefinitions,
    template: ({ values, setValue }) => renderUsersFilterFields(values, setValue),
  },
  sorting: {
    enabled: true,
    initialSortKey: "name",
    initialSortDirection: "asc",
  },
  pagination: {
    enabled: true,
    mode: "load-more",
    initialPageSize: 5,
    loadMoreLabel: "Load more users",
  },
  emptyState: {
    noDataTitle: EMPTY_USERS_TITLE,
    noDataDescription: EMPTY_USERS_DESCRIPTION,
  },
};

export const usersMobileListConfig: ListConfig<User, UsersFilterKey> = {
  search: {
    enabled: true,
    label: "Search users",
    placeholder: "Search by name, email, role, or status",
    fields: ["name", "email", "role", "status"],
  },
  filters: {
    enabled: true,
    title: "Filter users",
    triggerLabel: "Filters",
    definitions: usersFilterDefinitions,
    template: ({ values, setValue }) => renderUsersFilterFields(values, setValue),
  },
  sorting: {
    enabled: true,
    initialSortKey: "name",
    initialSortDirection: "asc",
  },
  pagination: {
    enabled: true,
    mode: "load-more",
    initialPageSize: 5,
    loadMoreLabel: "Load more users",
  },
  emptyState: {
    noDataTitle: EMPTY_USERS_TITLE,
    noDataDescription: EMPTY_USERS_DESCRIPTION,
  },
};

export function renderUserProfileLink(userId: number) {
  return (
    <Link
      href={`/users/${userId}`}
      className="inline-block text-sm font-medium text-primary hover:underline"
    >
      View profile
    </Link>
  );
}
