"use client";

import { useCallback, useMemo, useState } from "react";
import ResponsiveList from "@/components/shared/list/ResponsiveList";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useUsers } from "@/lib/hooks/useUsers";
import type { User } from "@/lib/users/types";
import {
  renderUserProfileLink,
  usersMobileStateConfig,
} from "./tableConfigs";
import {
  UsersMutateProvider,
  useUsersMutateOptional,
} from "./UsersMutateContext";
import UsersFormDialog from "./UsersFormDialog";

function UserMobileCard({ user }: { user: User }) {
  const mutate = useUsersMutateOptional();
  return (
    <Card className="border-stroke bg-panel">
      <CardHeader className="flex items-start justify-between gap-3">
        <CardTitle as="p">{user.name}</CardTitle>
        <Badge variant={user.status === "active" ? "success" : "warning"}>
          {user.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-subtle">{user.email}</p>
        <p className="text-sm text-subtle">Role: {user.role}</p>
        <div className="flex flex-wrap items-center gap-2">
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
          {renderUserProfileLink(user.id)}
        </div>
      </CardContent>
    </Card>
  );
}

export default function UsersPageClient() {
  const {
    users,
    mobileUsers,
    loading,
    loadingMore,
    error,
    refetch,
    upsertUserAfterMutation,
    userColumns,
    desktopTableConfig,
    mobileListConfig,
  } = useUsers();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const mutateValue = useMemo(
    () => ({
      openCreate: () => {
        setDialogMode("create");
        setEditUserId(null);
        setDialogOpen(true);
      },
      openEdit: (user: User) => {
        setDialogMode("edit");
        setEditUserId(user.id);
        setDialogOpen(true);
      },
    }),
    []
  );

  const handleDialogSuccess = useCallback(
    (user: User, kind: "create" | "update") => {
      upsertUserAfterMutation(user, kind);
    },
    [upsertUserAfterMutation]
  );

  return (
    <UsersMutateProvider value={mutateValue}>
      <section className="space-y-4" aria-labelledby="users-title">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1
            id="users-title"
            className="text-display-sm font-semibold text-primary"
          >
            Users
          </h1>
          <Button type="button" onClick={mutateValue.openCreate}>
            Add new user
          </Button>
        </header>

        <ResponsiveList<User, "role" | "status">
          data={users}
          mobileData={mobileUsers}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          onRetry={refetch}
          getKey={(user) => user.id}
          columns={userColumns}
          desktopTableConfig={desktopTableConfig}
          mobileListConfig={mobileListConfig}
          mobileStateConfig={usersMobileStateConfig}
          renderItem={(user) => <UserMobileCard user={user} />}
        />

        <UsersFormDialog
          key={`dlg-${String(dialogOpen)}-${dialogMode}-${editUserId ?? "n"}`}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode={dialogMode}
          editUserId={editUserId}
          initialDetail={null}
          onSuccess={handleDialogSuccess}
        />
      </section>
    </UsersMutateProvider>
  );
}
