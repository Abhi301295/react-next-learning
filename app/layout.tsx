import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://user-dashboard.local"),
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
  },
  twitter: {
    card: "summary",
    title: "User Dashboard",
    description: "Manage users with reusable table controls and form workflows.",
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
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}