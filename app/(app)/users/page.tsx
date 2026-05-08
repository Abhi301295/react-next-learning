import type { Metadata } from "next";
import UsersPageClient from "./UsersPageClient";

export const metadata: Metadata = {
  title: "Users",
  description: "Browse and manage users.",
  alternates: {
    canonical: "/users",
  },
};

export default function UsersPage() {
  return <UsersPageClient />;
}

