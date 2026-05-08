import "./globals.css";
import { Providers } from "./providers";
import type { Metadata } from "next";
import type { ReactNode } from "react";

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

/** Matches ThemeProvider + theme-context STORAGE_KEY; runs before hydration. */
const THEME_INIT_JS = `(function(){try{var k='dashboard-theme',m=localStorage.getItem(k);if(m!=='light'&&m!=='dark'&&m!=='system')m='system';var r=document.documentElement;var dark=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);r.classList.toggle('dark',dark);r.style.colorScheme=dark?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Executed before first paint to avoid light->dark flicker.
          dangerouslySetInnerHTML={{ __html: THEME_INIT_JS }}
        />
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
