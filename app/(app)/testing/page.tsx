import UsersClient from "./client-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testing",
  description: "Testing area for redirects and users flow.",
  alternates: {
    canonical: "/testing",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TestingPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Testing Redirects and Users</h1>
      <UsersClient />
    </div>
  );
}