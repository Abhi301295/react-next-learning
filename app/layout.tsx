import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { ThemeProvider } from "@/context/theme-context";

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
      <body className="min-h-screen bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function() {
            const key = "dashboard-theme";
            const savedTheme = localStorage.getItem(key);
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const themeMode = savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
              ? savedTheme
              : "system";
            const theme = themeMode === "system"
              ? (prefersDark ? "dark" : "light")
              : themeMode;
            document.documentElement.classList.toggle("dark", theme === "dark");
          })();
        `}</Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}