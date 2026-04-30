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

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>

            <List
                data={users}
                loading={loading}
                error={error}
                getKey={(u) => String(u.id)}
                renderItem={(user) => (
                    <div className="border p-3 rounded">
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </div>
                )}
            />
        </div>
    );
}

export default Day3Client;