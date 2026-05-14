"use client";

import { createContext, useContext } from "react";
import type { User } from "@/lib/users/types";

export type UsersMutateContextValue = {
  openCreate: () => void;
  openEdit: (user: User) => void;
};

const UsersMutateContext = createContext<UsersMutateContextValue | null>(null);

export function UsersMutateProvider({
  value,
  children,
}: {
  value: UsersMutateContextValue;
  children: React.ReactNode;
}) {
  return (
    <UsersMutateContext.Provider value={value}>
      {children}
    </UsersMutateContext.Provider>
  );
}

/** Returns null outside `UsersMutateProvider` (e.g. Storybook). */
export function useUsersMutateOptional(): UsersMutateContextValue | null {
  return useContext(UsersMutateContext);
}
