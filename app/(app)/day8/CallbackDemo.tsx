"use client";

import { Button } from "@/components/ui/Button";
import { shuffleList } from "@/lib/utils";
import { useCallback, useState } from "react";
import { DAY8_ALL_USERS } from "./demoData";
import Search from "./Search";

export function CallbackDemo() {
  const [users, setUsers] = useState<string[]>(() => [...DAY8_ALL_USERS]);

  const handleSearch = useCallback((text: string) => {
    const filteredUsers = DAY8_ALL_USERS.filter((user) =>
      user.includes(text)
    );
    setUsers(filteredUsers);
  }, []);

  return (
    <section className="mt-4 space-y-3" aria-label="User search and list">
      <div className="flex w-full items-end gap-2">
        <div className="shrink-0">
          <Button
            variant="primary"
            onClick={() => setUsers((prev) => shuffleList(prev))}
          >
            Shuffle Users
          </Button>
        </div>
        <div className="w-full max-w-sm">
          <Search onChange={handleSearch} />
        </div>
      </div>

      <ul className="mt-2 list-disc pl-5" aria-live="polite">
        {users.map((user, index) => (
          <li key={`${user}-${index}`}>{user}</li>
        ))}
      </ul>
    </section>
  );
}
