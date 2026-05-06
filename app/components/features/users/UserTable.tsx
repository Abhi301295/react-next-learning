import Table from "@/components/shared/table/core/Table";
import Badge from "@/components/ui/Badge";
import { User } from "@/lib/hooks/useUsers";

import type { Column, SortDirection } from "@/components/shared/table/core/Table";

export const userTableColumns: Column<User>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  {
    key: "role",
    label: "Role",
    sortable: true,
    render: (value) => (
      <span className="capitalize">{value}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value) => (
      <Badge variant={value === "active" ? "success" : "error"}>
        {value}
      </Badge>
    ),
  },
];

type UserTableProps = {
  users: User[];
  rowActions?: (user: User) => React.ReactNode;
  rowActionsLabel?: string;
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  allVisibleSelected?: boolean;
  onToggleRow?: (key: string | number) => void;
  onToggleAllVisible?: () => void;
  sortBy?: keyof User | null;
  sortDirection?: SortDirection;
  onSortChange?: (key: keyof User) => void;
};

export default function UserTable({
  users,
  rowActions,
  rowActionsLabel,
  selectable,
  selectedKeys,
  allVisibleSelected,
  onToggleRow,
  onToggleAllVisible,
  sortBy,
  sortDirection,
  onSortChange,
}: UserTableProps) {
  return (
    <Table
      data={users}
      columns={userTableColumns}
      getKey={(user) => user.id}
      rowActions={rowActions}
      rowActionsLabel={rowActionsLabel}
      selectable={selectable}
      selectedKeys={selectedKeys}
      allVisibleSelected={allVisibleSelected}
      onToggleRow={onToggleRow}
      onToggleAllVisible={onToggleAllVisible}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
    />
  );
}