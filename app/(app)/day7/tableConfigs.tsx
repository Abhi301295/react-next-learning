import TableFilterField from "@/components/shared/table/filters/TableFilterField";
import { userTableColumns } from "@/components/features/users/UserTable";
import type {
  FilterTemplateContext,
  TableConfig,
} from "@/components/shared/table/core/ConfigurableTable";
import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/hooks/useUsers";
import type { FilterValue } from "@/lib/hooks/useTableControls";

export type Day7FilterKey =
  | "status"
  | "joinedAfter"
  | "includeInactive"
  | "roles"
  | "departments";

const getJoinedDate = (userId: number) => {
  const month = (userId % 12) + 1;
  const day = (userId % 27) + 1;
  return `2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const departmentOptions = [
  "Engineering",
  "Design",
  "Marketing",
  "Support",
  "Finance",
];

const getDepartment = (userId: number) => departmentOptions[userId % departmentOptions.length];

const filterDefinitions = [
  {
    key: "status" as Day7FilterKey,
    initialValue: "all",
    predicate: (user: User, value: FilterValue) =>
      value === "all" || user.status === String(value),
  },
  {
    key: "joinedAfter" as Day7FilterKey,
    initialValue: "",
    predicate: (user: User, value: FilterValue) => {
      const dateValue = String(value);
      if (!dateValue) return true;
      return getJoinedDate(user.id) >= dateValue;
    },
  },
  {
    key: "includeInactive" as Day7FilterKey,
    initialValue: true,
    predicate: (user: User, value: FilterValue) => {
      const includeInactive = Boolean(value);
      if (includeInactive) return true;
      return user.status === "active";
    },
  },
  {
    key: "roles" as Day7FilterKey,
    initialValue: [] as string[],
    predicate: (user: User, value: FilterValue) => {
      const selectedRoles = Array.isArray(value) ? value : [];
      if (selectedRoles.length === 0) return true;
      return selectedRoles.includes(user.role);
    },
  },
  {
    key: "departments" as Day7FilterKey,
    initialValue: [] as string[],
    predicate: (user: User, value: FilterValue) => {
      const selectedDepartments = Array.isArray(value) ? value : [];
      if (selectedDepartments.length === 0) return true;
      return selectedDepartments.includes(getDepartment(user.id));
    },
  },
];

const renderFilterFields = (
  values: Record<Day7FilterKey, FilterValue>,
  setValue: (key: Day7FilterKey, value: FilterValue) => void,
  layoutClassName?: string
) => (
  <div className={layoutClassName}>
    <TableFilterField
      type="radio-group"
      label="Status"
      value={values.status}
      onChange={(value) => setValue("status", value)}
      options={[
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ]}
    />
    <TableFilterField
      type="date"
      label="Joined After"
      value={values.joinedAfter}
      onChange={(value) => setValue("joinedAfter", value)}
    />
    <TableFilterField
      type="checkbox"
      label="Include Inactive Users"
      value={values.includeInactive}
      onChange={(value) => setValue("includeInactive", value)}
    />
    <TableFilterField
      type="checkbox-group"
      label="Roles"
      value={values.roles}
      onChange={(value) => setValue("roles", value)}
      options={[
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ]}
    />
    <TableFilterField
      type="multi-select"
      label="Departments (Searchable)"
      value={values.departments}
      onChange={(value) => setValue("departments", value)}
      searchable
      searchPlaceholder="Search departments..."
      options={departmentOptions.map((department) => ({
        label: department,
        value: department,
      }))}
    />
  </div>
);

export const userRowActions = (user: User) => (
  <>
    <Button
      type="button"
      size="sm"
      variant="outline"
      iconOnly
      icon="👁"
      aria-label={`View user ${user.name}`}
      onClick={() => {}}
    />
    <Button
      type="button"
      size="sm"
      variant="outline"
      icon="✎"
      className="w-full sm:w-auto"
      onClick={() => {}}
    >
      Edit
    </Button>
  </>
);


export const panelTableConfig: TableConfig<User, Day7FilterKey> = {
  columns: userTableColumns,
  getKey: (user) => user.id,
  rowActionsLabel: "Row Actions",
  rowActions: userRowActions,
  search: {
    enabled: true,
    label: "Search",
    placeholder: "Search by name or email",
    fields: ["name", "email"],
  },
  filters: {
    enabled: true,
    mode: "panel",
    title: "Configurable Filters (Radio + Date + Checkbox + Searchable Select)",
    triggerLabel: "Open Filter Panel",
    definitions: filterDefinitions,
    template: ({ values, setValue }: FilterTemplateContext<Day7FilterKey>) =>
      renderFilterFields(values, setValue, "grid gap-4 lg:grid-cols-2"),
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
  selection: {
    enabled: true,
    bulkActionLabel: "Export Selected",
    onBulkAction: () => {},
  },
};
