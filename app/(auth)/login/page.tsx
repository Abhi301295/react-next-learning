import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/metadata/defaults";
import LoginFormGate from "./LoginFormGate";

const loginTitle = "Login";
const loginDescription = `Sign in to access ${SITE_NAME}.`;

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
      <section className="relative flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle as="h1" className="text-center text-xl">
                Sign in
              </CardTitle>
              <p className="mt-2 text-center text-xs text-subtle">
                Sign in with the username and password issued for your account.
              </p>
            </CardHeader>
            <CardContent>
              <LoginFormGate />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
