import TableFilterField from "@/components/shared/table/filters/TableFilterField";
import { userTableColumns } from "@/components/features/users/UserTable";
import type {
  FilterTemplateContext,
  TableConfig,
} from "@/components/shared/table/core/ConfigurableTable";
import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/hooks/useUsers";

export type Day7FilterKey = "status" | "role";

const filterDefinitions = [
  {
    key: "status" as Day7FilterKey,
    initialValue: "all",
    predicate: (user: User, value: string) => value === "all" || user.status === value,
  },
  {
    key: "role" as Day7FilterKey,
    initialValue: "all",
    predicate: (user: User, value: string) => value === "all" || user.role === value,
  },
];

const renderFilterFields = (
  values: Record<Day7FilterKey, string>,
  setValue: (key: Day7FilterKey, value: string) => void,
  layoutClassName?: string
) => (
  <div className={layoutClassName}>
    <TableFilterField
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
      label="Role"
      value={values.role}
      onChange={(value) => setValue("role", value)}
      options={[
        { label: "All", value: "all" },
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ]}
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
    title: "Configure Filters",
    triggerLabel: "Open Filter Panel",
    definitions: filterDefinitions,
    template: ({ values, setValue }: FilterTemplateContext<Day7FilterKey>) =>
      renderFilterFields(values, setValue, "grid gap-3 md:grid-cols-2"),
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
