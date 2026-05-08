// app/login/page.tsx

import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to access the user dashboard.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <main>
      <h1 className="sr-only">Login</h1>
      <LoginForm />
    </main>
  );
}