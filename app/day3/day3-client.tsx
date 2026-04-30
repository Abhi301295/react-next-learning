'use client';

import List from "@/components/shared/list/List";
import ResponsiveList from "@/components/shared/list/ResponsiveList";
import Input from "@/components/ui/input";
import { useUsers } from "@/lib/hooks/useUsers";
import { useListControls } from "@/lib/hooks/userListControls";

const Day3Client = () => {
    const { users, loading, error } = useUsers();
    const {
        search,
        setSearch,
        page,
        setPage,
        totalPages,
        data,
    } = useListControls({ data: users, searchKey: "name", itemsPerPage: 3 })

    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
    ] as const;

    return (
        <section
            aria-labelledby="users-heading"
            className="max-w-3xl mx-auto space-y-6"
        >
            <header className="space-y-3">
                <h1 id="users-heading" className="text-2xl font-bold">
                    Users
                </h1>

                <div className="max-w-sm">
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        inputSize="sm"
                        variant="outline"
                    />
                </div>
            </header>

            <ResponsiveList
                data={data}
                loading={loading}
                error={error}
                getKey={(u) => String(u.id)}
                columns={columns}
                renderItem={(user) => (
                    <article className="border rounded-md p-4">
                        <h2 className="font-medium">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </article>
                )}
            />

            <nav
                aria-label="Pagination"
                className="flex items-center justify-between"
            >
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </nav>
        </section>
    );
}

export default Day3Client;