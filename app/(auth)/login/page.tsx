import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";

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

const loginTitle = "Login";
const loginDescription =
  "Sign in with your DummyJSON username and password to access the User Dashboard.";

export const metadata: Metadata = {
  title: loginTitle,
  description: loginDescription,
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: `${loginTitle} | User Dashboard`,
    description: loginDescription,
    url: "/login",
    type: "website",
    siteName: "User Dashboard",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${loginTitle} | User Dashboard`,
    description: loginDescription,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
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
