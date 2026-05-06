'use client';

import { EmptyState } from "@/components/shared/feedback/EmptyState";
import { ErrorState } from "@/components/shared/feedback/ErrorState";
import { LoadingState } from "@/components/shared/feedback/LoadingState";
import ResponsiveList from "@/components/shared/list/ResponsiveList";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useListControls } from "@/lib/hooks/useListControls";
import { useUsers } from "@/lib/hooks/useUsers";

const Day3Client = () => {
  const { users, loading, error, refetch } = useUsers();

  const { search, setSearch, page, setPage, totalPages, data } = useListControls({
    data: users,
    searchKey: "name",
    itemsPerPage: 3,
  });

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ] as const;

  return (
    <section aria-labelledby="users-heading" className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-3">
        <h1 id="users-heading" className="text-2xl font-bold">
          Users
        </h1>

        <div className="w-full sm:max-w-sm md:max-w-md">
          <label htmlFor="search-users" className="sr-only">
            Search users by name
          </label>

          <Input
            id="search-users"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            inputSize="sm"
            variant="outline"
          />
        </div>
      </header>

      {loading && <LoadingState />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && users.length === 0 && (
        <EmptyState
          title="No users found"
          description="Try adjusting your search or add new users"
        />
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <ResponsiveList
            data={data}
            getKey={(u) => String(u.id)}
            columns={columns}
            renderItem={(user) => (
              <Card>
                <CardHeader>
                  <CardTitle>{user.name}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </CardContent>
              </Card>
            )}
          />

          <nav
            aria-label="Pagination"
            className="flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row"
          >
            <Button
              size="md"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              aria-label="Go to previous page"
            >
              ← Prev
            </Button>

            <span className="text-sm text-gray-600">
              Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
            </span>

            <Button
              size="md"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              aria-label="Go to next page"
            >
              Next →
            </Button>
          </nav>
        </>
      )}
    </section>
  );
};

export default Day3Client;
