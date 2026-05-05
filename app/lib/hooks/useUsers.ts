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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/users");

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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchUsers();
    });
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}