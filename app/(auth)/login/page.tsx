import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const LoginForm = dynamic(
  () => import("@/components/auth/LoginForm").then((m) => m.default),
  {
    loading: () => (
      <div
        className="flex min-h-screen items-center justify-center bg-background px-4"
        aria-busy="true"
        aria-label="Loading sign-in form"
      >
        <div className="h-48 w-full max-w-md animate-pulse rounded-xl border border-stroke bg-panel shadow-sm" />
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in with your DummyJSON username to access the dashboard.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
