import "./globals.css";
import { Providers } from "./providers";
import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Runs before React—sets `html.dark` + `color-scheme` from localStorage (key must match theme-context). */
const THEME_BOOT_SCRIPT = `(function(){try{var k='dashboard-theme',m=localStorage.getItem(k);if(m!=='light'&&m!=='dark'&&m!=='system')m='system';var r=document.documentElement;var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

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
      <body
        className="min-h-screen bg-background text-foreground"
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}