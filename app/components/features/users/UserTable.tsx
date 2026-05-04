import Table from "@/components/shared/table/Table";
import Badge from "@/components/ui/Badge";
import { User } from "@/lib/hooks/useUsers";

import type { Column } from "@/components/shared/table/Table";

const columns: Column<User>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "role",
    label: "Role",
    render: (value) => (
      <span className="capitalize">{value}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Badge variant={value === "active" ? "success" : "error"}>
        {value}
      </Badge>
    ),
  },
];

export default function UserTable({ users }: { users: User[] }) {
  return (
    <Table
      data={users}
      columns={columns}
      getKey={(user) => user.id}
    />
  );
}