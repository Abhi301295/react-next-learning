"use client";

import { useEffect, useState, useCallback } from "react";

type ApiUser = {
  id: number;
  name: string;
  email: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (signal?: AbortSignal) => {
    let requestAborted = false;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/users", { signal });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: ApiUser[] = await res.json();

      const mappedUsers: User[] = data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.id % 2 === 0 ? "admin" : "user",
        status: user.id % 3 === 0 ? "inactive" : "active",
      }));

      setUsers(mappedUsers);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        requestAborted = true;
        return;
      }
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      if (requestAborted || signal?.aborted) return;
      setLoading(false);
      setHasFetched(true);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => fetchUsers(controller.signal));
    return () => controller.abort();
  }, [fetchUsers]);

  return {
    users,
    loading,
    hasFetched,
    error,
    refetch: fetchUsers,
  };
}