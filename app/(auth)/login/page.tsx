import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in with your DummyJSON username to access the dashboard.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <main>
      <h1 className="sr-only">Sign in</h1>
      <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
