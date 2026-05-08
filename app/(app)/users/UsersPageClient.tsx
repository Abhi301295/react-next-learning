"use client";

import Link from "next/link";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import { ErrorState } from "@/components/shared/feedback/ErrorState";
import { LoadingState } from "@/components/shared/feedback/LoadingState";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUsers } from "@/lib/hooks/useUsers";

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

      {loading && <LoadingState />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && users.length === 0 && (
        <EmptyState
          title="No users found"
          description="Try again or check your API configuration."
        />
      )}

      {!loading && !error && users.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {users.map((user) => (
            <Card key={user.id} className="border-stroke bg-panel">
              <CardHeader className="flex items-start justify-between gap-3">
                <CardTitle>{user.name}</CardTitle>
                <Badge variant={user.status === "active" ? "success" : "warning"}>
                  {user.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-subtle">{user.email}</p>
                <p className="text-sm text-subtle">Role: {user.role}</p>
                <Link
                  href={`/users/${user.id}`}
                  className="inline-block text-sm font-medium text-brand-600 hover:underline"
                >
                  View profile
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

