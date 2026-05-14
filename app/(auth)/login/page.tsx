import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/metadata/defaults";

const loginTitle = "Login";
const loginDescription = `Sign in with your username and password to access ${SITE_NAME}.`;

export const metadata: Metadata = {
  title: loginTitle,
  description: loginDescription,
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: `${loginTitle} | ${SITE_NAME}`,
    description: loginDescription,
    url: "/login",
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${loginTitle} | ${SITE_NAME}`,
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
      <Suspense
        fallback={<div className="min-h-screen bg-background" aria-hidden />}
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
