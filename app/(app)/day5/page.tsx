import AddUserForm from "@/components/forms/AddUserForm";
import type { Metadata } from "next";

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