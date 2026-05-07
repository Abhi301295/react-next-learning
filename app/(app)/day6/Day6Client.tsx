'use client';

import UserTable from '@/components/features/users/UserTable';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { LoadingState } from '@/components/shared/feedback/LoadingState'
import { useUsers } from '@/lib/hooks/useUsers';

const Day6Client = () => {
    const { users, loading, error, refetch } = useUsers();

    return (
        <div className="p-4 space-y-6">

            <header>
                <h1 className="text-2xl font-semibold">User Management</h1>
                <p className="text-sm text-subtle">
                    View and manage all users in the system
                </p>
            </header>

            {loading && <LoadingState />}

            {!loading && error && (
                <ErrorState
                    message={error}
                    onRetry={refetch}
                />
            )}

            {!loading && !error && users.length === 0 && (
                <EmptyState
                    title="No users found"
                    description="Start by adding a new user to the system"
                />
            )}

            {!loading && !error && users.length > 0 && (
                <section className="space-y-4">

                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">
                            Users List
                        </h2>

                        <span className="text-sm text-subtle">
                            Total: {users.length}
                        </span>
                    </div>

                    <UserTable users={users} />

                </section>
            )}

        </div>
    )
}

export default Day6Client;