'use client';

import List from "@/components/shared/list/List";
import { useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
};

const Day3Client = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch("api/users");

                if (!res.ok) {
                    throw new Error('failed to fetch data');
                }

                const data: User[] = await res.json();
                setUsers(data);
            } catch (err: any) {
                setError(err.message || 'something went wrong');
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);
    if (loading) return <p>Loading users...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (users.length === 0) return <p>No users found</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>

            <List
                data={users}
                getKey={(u) => String(u.id)}
                renderItem={(user) => (
                    <div className="border p-3 rounded">
                        <h2 className="font-semibold">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                )}
            />
        </div>
    );
}

export default Day3Client;