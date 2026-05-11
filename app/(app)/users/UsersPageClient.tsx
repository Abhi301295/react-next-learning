"use client";

import ResponsiveList from "@/components/shared/list/ResponsiveList";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUsers } from "@/lib/hooks/useUsers";
import type { User } from "@/lib/users/types";
import {
  renderUserProfileLink,
  usersMobileStateConfig,
} from "./tableConfigs";

function renderUserCard(user: User) {
  return (
    <Card className="border-stroke bg-panel">
      <CardHeader className="flex items-start justify-between gap-3">
        <CardTitle>{user.name}</CardTitle>
        <Badge variant={user.status === "active" ? "success" : "warning"}>
          {user.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-subtle">{user.email}</p>
        <p className="text-sm text-subtle">Role: {user.role}</p>
        {renderUserProfileLink(user.id)}
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
    userColumns,
    desktopTableConfig,
    mobileListConfig,
  } = useUsers();

  return (
    <section className="space-y-4" aria-labelledby="users-title">
      <header>
        <h1 id="users-title" className="text-display-sm font-semibold text-primary">
          Users
        </h1>
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
        renderItem={renderUserCard}
      />
    </section>
  );
}

