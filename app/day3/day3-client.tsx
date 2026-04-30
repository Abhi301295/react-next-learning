'use client';

import ResponsiveList from "@/components/shared/list/ResponsiveList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

                <div className="w-full sm:max-w-sm md:max-w-md">
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
                className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-4"
            >
                <Button
                    size="md"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    aria-label="Previous page"
                >
                    ← Prev
                </Button>

                <span className="text-sm text-gray-600">
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>

                <Button
                    size="md"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    aria-label="Next page"
                >
                    Next →
                </Button>
            </nav>
        </section>
    );
}

export default Day3Client;