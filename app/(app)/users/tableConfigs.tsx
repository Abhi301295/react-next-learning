"use client";

/**
 * Shared table + mobile list config for the users area.
 * `useUsers` injects `server` (fetch, pagination, search) at runtime.
 */

import Link from "next/link";
import { messages } from "@/lib/constants/messages";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import type { ListConfig } from "@/components/shared/list/List";
import { UsersMobileCardsSkeleton } from "./UsersMobileCardsSkeleton";
import TableFilterField from "@/components/shared/table/filters/TableFilterField";
import type {
  FilterTemplateContext,
  TableConfig,
} from "@/components/shared/table/core/ConfigurableTable";
import Badge from "@/components/ui/Badge";
import type { Column } from "@/components/shared/table/core/Table";
import type { User } from "@/lib/users/types";
import { Button } from "@/components/ui/Button";
import { useUsersMutateOptional } from "./UsersMutateContext";

// ─── 1. Filter keys (used as generic `K` in TableConfig / ListConfig) ─────────

export type UsersFilterKey = "role" | "status";

// ─── 2. Desktop table columns (`ResponsiveList` passes this as `columns`) ───

export const USER_COLUMNS: readonly Column<User, keyof User>[] = [
  { key: "id", label: "User ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  {
    key: "role",
    label: "Role",
    sortable: true,
    render: (value) => (
      <span className="capitalize">{String(value)}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value) => (
      <Badge variant={value === "active" ? "success" : "warning"}>
        {String(value)}
      </Badge>
    ),
  },
];

// ─── 3. Filter definitions (predicates; used client-side + filter panel) ─────

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

// ─── 4. `USERS_FILTERS` (template + metadata; used by table and list) ─────────

function UsersFilterFields(ctx: FilterTemplateContext<UsersFilterKey>) {
  return (
    <div className="space-y-3">
      <TableFilterField
        label="Role"
        value={ctx.values.role}
        onChange={(value) => ctx.setValue("role", value)}
        options={[
          { label: "All roles", value: "all" },
          { label: "Admin", value: "admin" },
          { label: "User", value: "user" },
        ]}
      />
      <TableFilterField
        label="Status"
        value={ctx.values.status}
        onChange={(value) => ctx.setValue("status", value)}
        options={[
          { label: "All statuses", value: "all" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ]}
      />
    </div>
  );
}

/**
 * Shared by **table and list** (`TableConfig` and `ListConfig` use the same shape).
 */
const USERS_FILTERS = {
  enabled: true,
  title: messages.users.filterTitle,
  triggerLabel: "Filters",
  definitions: usersFilterDefinitions,
  template: UsersFilterFields,
} as const;

// ─── 5. Row action column (desktop table only; not used by mobile cards) ─────

function UserDetailNavLink({ user }: { user: User }) {
  return (
    <Button
      href={`/users/${user.id}`}
      variant="outline"
      iconOnly
      aria-label={`View profile for ${user.name}`}
      tooltip={`View ${user.name}`}
    >
      👁
    </Button>
  );
}

function UserRowActions({ user }: { user: User }) {
  const mutate = useUsersMutateOptional();
  return (
    <div className="flex items-center justify-end gap-2">
      {mutate ? (
        <Button
          type="button"
          variant="outline"
          iconOnly
          onClick={() => mutate.openEdit(user)}
          aria-label={`Edit ${user.name}`}
          tooltip={`Edit ${user.name}`}
        >
          ✎
        </Button>
      ) : null}
      <UserDetailNavLink user={user} />
    </div>
  );
}

const USERS_TABLE_ACTIONS = {
  rowActionsLabel: "Actions" as const,
  rowActions: (user: User) => <UserRowActions user={user} />,
};

// ─── 6. Search (`GET /api/users` uses a single `q`; role/status via filters) ─

const USERS_SEARCH: NonNullable<TableConfig<User, UsersFilterKey>["search"]> = {
  enabled: true,
  label: "Search users",
  placeholder: messages.users.searchPlaceholder,
  fields: ["name", "email"],
};

// ─── 7. Sorting (shared defaults; list adds `mobileFields` for sort dropdown) ─

const USERS_SORT_CORE: NonNullable<TableConfig<User, UsersFilterKey>["sorting"]> = {
  enabled: true,
  initialSortKey: "name",
  initialSortDirection: "asc",
};

const USERS_MOBILE_SORT_FIELDS = [
  { key: "id", label: "User ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
] as const;

// ─── 9. Empty state strings (table + list empty / no-results variants) ──────

const USERS_EMPTY: NonNullable<TableConfig<User, UsersFilterKey>["emptyState"]> = {
  noDataTitle: messages.users.emptyListTitle,
  noDataDescription: messages.users.emptyListDescription,
};

/** Search + empty copy reused on both breakpoints. */
const USERS_RESPONSIVE_CONTROLS = {
  search: USERS_SEARCH,
  emptyState: USERS_EMPTY,
};

// ─── 10. Pagination (table = pages; list = infinite “load more”) ──────────────

const USERS_PAGINATION_TABLE: NonNullable<
  TableConfig<User, UsersFilterKey>["pagination"]
> = {
  enabled: true,
  initialPageSize: 5,
  pageSizeOptions: [5, 10, 20],
};

const USERS_PAGINATION_LIST: NonNullable<
  ListConfig<User, UsersFilterKey>["pagination"]
> = {
  enabled: true,
  mode: "load-more",
  initialPageSize: 5,
  loadMoreLabel: "Load more users",
};

// ─── 11. Composed configs (hook adds `server` + `columns` / `getKey`) ─────────

/** Desktop: `useUsers` spreads this then `{ server: … }`. */
export const usersPaginatedDesktopBase: Omit<
  TableConfig<User, UsersFilterKey>,
  "columns" | "getKey" | "server"
> = {
  ...USERS_TABLE_ACTIONS,
  ...USERS_RESPONSIVE_CONTROLS,
  filters: USERS_FILTERS,
  sorting: USERS_SORT_CORE,
  pagination: USERS_PAGINATION_TABLE,
};

/** Mobile: `useUsers` spreads this then `{ server: … }`. */
export const usersPaginatedMobileListBase: Omit<
  ListConfig<User, UsersFilterKey>,
  "server"
> = {
  ...USERS_RESPONSIVE_CONTROLS,
  filters: USERS_FILTERS,
  sorting: {
    ...USERS_SORT_CORE,
    mobileFields: USERS_MOBILE_SORT_FIELDS,
  },
  pagination: USERS_PAGINATION_LIST,
};

// ─── 12. Aliases (same shapes; useful if a page uses table without `server`) ─

export const usersDesktopTableConfig: Omit<
  TableConfig<User, UsersFilterKey>,
  "columns" | "getKey"
> = usersPaginatedDesktopBase;

export const usersMobileListConfig: ListConfig<User, UsersFilterKey> =
  usersPaginatedMobileListBase;

// ─── 13. ResponsiveList optional override (custom empty on mobile cards) ─────

export const usersMobileStateConfig = {
  emptyComponent: (
    <EmptyState
      title={messages.users.emptyListTitle}
      description={messages.users.emptyListDescription}
    />
  ),
  /**
   * Override the generic cards `LoadingState` with a skeleton tuned to the
   * actual `renderUserCard` height (and reserve the load-more footer),
   * so the mobile list does not shift when the first page resolves.
   */
  loadingComponent: <UsersMobileCardsSkeleton />,
};

// ─── 14. Card body helper (not part of TableConfig / ListConfig) ─────────────

export function renderUserProfileLink(userId: string | number) {
  return (
    <Link
      href={`/users/${encodeURIComponent(String(userId))}`}
      className="inline-block text-sm font-medium text-primary hover:underline"
    >
      View profile
    </Link>
  );
}
