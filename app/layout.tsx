import "./globals.css";
import { Providers } from "./providers";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeInitScript } from "./components/theme/ThemeInitScript";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://user-dashboard.local"
  ),
  title: {
    default: "User Dashboard",
    template: "%s | User Dashboard",
  },
  description: "User management dashboard built with React and Next.js.",
  applicationName: "User Dashboard",
  keywords: ["user dashboard", "nextjs", "react", "admin", "user management"],
  authors: [{ name: "User Dashboard Team" }],
  openGraph: {
    title: "User Dashboard",
    description: "Manage users with reusable table controls and form workflows.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/file.svg",
        alt: "User Dashboard Open Graph preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "User Dashboard",
    description: "Manage users with reusable table controls and form workflows.",
    images: ["/file.svg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body
        className="min-h-screen bg-background text-foreground"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
