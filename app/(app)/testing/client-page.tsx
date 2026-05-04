"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
};

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
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