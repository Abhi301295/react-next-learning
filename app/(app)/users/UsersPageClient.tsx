"use client";

import ResponsiveList from "@/components/shared/list/ResponsiveList";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUsers, type User } from "@/lib/hooks/useUsers";
import {
  renderUserProfileLink,
  USER_COLUMNS,
  usersDesktopTableConfig,
  usersMobileListConfig,
  usersMobileStateConfig,
  type UsersFilterKey,
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
  const { users, loading, error, refetch } = useUsers();

  return (
    <section className="space-y-4" aria-labelledby="users-title">
      <header>
        <h1 id="users-title" className="text-display-sm font-semibold text-brand-600">
          Users
        </h1>
        <p className="text-sm text-subtle">SEO-friendly route example: /users</p>
      </header>

      <ResponsiveList<User, UsersFilterKey>
        data={users}
        loading={loading}
        error={error}
        onRetry={refetch}
        getKey={(user) => user.id}
        columns={USER_COLUMNS}
        desktopTableConfig={usersDesktopTableConfig}
        mobileListConfig={usersMobileListConfig}
        mobileStateConfig={usersMobileStateConfig}
        renderItem={renderUserCard}
      />
    </section>
  );
}

