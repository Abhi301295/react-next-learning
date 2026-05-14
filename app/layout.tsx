import "./globals.css";
import { Providers } from "./providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeInitScript } from "./components/theme/ThemeInitScript";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/metadata/defaults";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  /** swap + preload improves FCP/LCP in lab without invisible text from `optional`. */
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://user-dashboard.local"
  ),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Sign in, review KPIs and recent activity, then search, filter, paginate, and edit users in a responsive Next.js dashboard.",
  applicationName: SITE_NAME,
  keywords: [
    "user management",
    "admin dashboard",
    "nextjs",
    "react",
    "tailwind",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "User directory with debounced search, filters, forms, and an accessible UI.",
    type: "website",
    url: "/",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "User directory with debounced search, filters, forms, and an accessible UI.",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
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
    <html
      lang="en"
      suppressHydrationWarning
      className={fontSans.variable}
    >
      <head>
        <ThemeInitScript />
      </head>
      <body
        className={`${fontSans.className} min-h-screen bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
