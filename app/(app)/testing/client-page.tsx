"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
};

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setError(null);
        const res = await fetch("/api/users", { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    void fetchUsers();
    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p role="alert">Failed to load users: {error}</p>;
  if (users.length === 0) return <p>No users found</p>;

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div key={user.id} className="border p-2 rounded">
          {user.name}
        </div>
      ))}
    </div>
  );
}