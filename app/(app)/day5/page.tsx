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
    <div className="min-h-screen p-6 bg-gray-50">

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">

        <h1 className="text-2xl font-semibold mb-4">
          Add New User
        </h1>

        <AddUserForm />

      </div>

    </div>
  );
}