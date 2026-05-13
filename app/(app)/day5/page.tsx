import type { Metadata } from "next";
import dynamic from "next/dynamic";

const AddUserForm = dynamic(
  () => import("@/components/forms/AddUserForm").then((m) => m.default),
  {
    loading: () => (
      <div
        className="h-72 w-full max-w-xl animate-pulse rounded-lg bg-stroke"
        aria-busy="true"
        aria-label="Loading form"
      />
    ),
  }
);

export const metadata: Metadata = {
  title: "Day 5 - Add User Form",
  description: "Create users with React Hook Form and Zod validation.",
  alternates: {
    canonical: "/day5",
  },
};

export default function AddUserPage() {
  return (
    <div className="min-h-screen bg-background p-6">

      <div className="mx-auto max-w-xl rounded-lg border border-stroke bg-panel p-6 shadow">

        <h1 className="text-2xl font-semibold mb-4">
          Add New User
        </h1>

        <AddUserForm />

      </div>

    </div>
  );
}