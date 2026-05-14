"use client";

/**
 * ============================================================================
 * USERS LISTING — TABLE + MOBILE CONFIG (“tableConfigs” pattern)
 * ============================================================================
 *
 * WHO USES THIS
 * - `UsersPageClient` → `ResponsiveList` → passes pieces from `useUsers()`.
 * - `useUsers` (`app/lib/hooks/useUsers.ts`) merges **`server`** (live URL state,
 *   fetch, pagination handlers) into the objects exported here.
 *
 * HOW THE UI SPLITS
 * - **Desktop (md+):** `ConfigurableTable` + **`TableConfig`** — grid, row actions,
 *   page-size pagination; filters use the same `filters` object as the list.
 * - **Mobile:** `List` + **`ListConfig`** — cards, “load more”, **`mobileFields`** on sort.
 *
 * WHAT MUST STAY IN SYNC
 * - **Search / filters / sort defaults / empty copy** are shared between both
 *   breakpoints (`*_RESPONSIVE_CONTROLS`, **`USERS_FILTERS`**, sort core).
 * - Only **pagination shape** differs between **`TableConfig`** and **`ListConfig`**.
 *   Search, filters, sort defaults, and empty copy are shared (`USERS_FILTERS`, etc.).
 *
 * UPSTREAM SEARCH NOTE
 * - List fetch uses **`GET /users/search?q=`** — one string, not per-column.
 * - **Role / status** are narrowed with **Filters** in this app, not implied by `q`.
 *
 * ADDING A NEW LISTING (copy this file as a template)
 * 1. Replace row type (`User`), filter keys, columns, empty strings.
 * 2. Fill **filter definitions** + one **template** (`FilterTemplateContext<K>`).
 * 3. Set **search** (label, placeholder honest about API, `fields` for docs/UI).
 * 4. Set **sort** + **mobileFields** (mobile only).
 * 5. Set **pagination** (table vs list shapes).
 * 6. Compose **`(entity)PaginatedDesktopBase`** and **`(entity)PaginatedMobileListBase`**.
 * 7. In a **`use<Entity>`** hook, `useMemo` spread the desktop base + `{ server }`,
 *    and the mobile base + `{ server }` the same way as `useUsers`.
 *
 * SECTION MAP (read top → bottom)
 * 1. Empty copy        2. Filter key type     3. Columns
 * 4. Filter definitions 5. Shared **`USERS_FILTERS`** (same object on table + list)
 * 6. Row actions        7. Search              8. Sort + mobile sort labels
 * 9. Empty object       10. Responsive merge (search + empty)
 * 11. Pagination        12. Composed desktop + mobile exports
 * 13. Aliases           14. Mobile empty override
 * 15. Card-only helpers
 * ============================================================================
 */

import Link from "next/link";
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

// ─── 1. Empty-state copy (also referenced by `usersMobileStateConfig`) ───────

export const EMPTY_USERS_TITLE = "No users found";
export const EMPTY_USERS_DESCRIPTION =
  "Try again or check your API configuration.";

// ─── 2. Filter keys (used as generic `K` in TableConfig / ListConfig) ─────────

export type UsersFilterKey = "role" | "status";

// ─── 3. Desktop table columns (`ResponsiveList` passes this as `columns`) ───

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

// ─── 4. Filter definitions (predicates; used client-side + filter panel) ─────

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

// ─── 5. `USERS_FILTERS` (template + metadata; used by table and list) ─────────

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
  title: "Filter users",
  triggerLabel: "Filters",
  definitions: usersFilterDefinitions,
  template: UsersFilterFields,
} as const;

// ─── 6. Row action column (desktop table only; not used by mobile cards) ─────

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

// ─── 7. Search (single `q` param upstream; `fields` = hint / non-server client use) ─

/**
 * Upstream: `GET /users/search?q=` — one text query (name, email, username, …).
 * Role and status are applied with **Filters**, not via `q`.
 */
const USERS_SEARCH: NonNullable<TableConfig<User, UsersFilterKey>["search"]> = {
  enabled: true,
  label: "Search users",
  placeholder:
    "Search by name, email, or username. Refine role and status with Filters.",
  fields: ["name", "email"],
};

// ─── 8. Sorting (shared defaults; list adds `mobileFields` for sort dropdown) ─

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
  noDataTitle: EMPTY_USERS_TITLE,
  noDataDescription: EMPTY_USERS_DESCRIPTION,
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
    <EmptyState title={EMPTY_USERS_TITLE} description={EMPTY_USERS_DESCRIPTION} />
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
