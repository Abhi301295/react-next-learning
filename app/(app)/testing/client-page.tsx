"use client";

import { useEffect, useState } from "react";
import { httpErrPublicMessage, isHttpOk } from "@/lib/app-api";
import { fetchUserListDummyJson } from "@/lib/users/client";
import { userListDisplayName } from "@/lib/users/map-row";

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

    const loadUsers = async () => {
      try {
        setError(null);
        const r = await fetchUserListDummyJson(
          {
            limit: 50,
            skip: 0,
            sortBy: "id",
            order: "asc",
          },
          controller.signal
        );
        if (!isHttpOk(r)) {
          if (r.kind === "aborted") return;
          setError(httpErrPublicMessage(r));
          return;
        }
        setUsers(
          r.data.users.map((row) => ({
            id: row.id,
            name: userListDisplayName(row),
          }))
        );
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
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