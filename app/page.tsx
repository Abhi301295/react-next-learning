import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/metadata/defaults";

const homeDescription = `Sign in or open your workspace in ${SITE_NAME}.`;

export const metadata: Metadata = {
  title: "Home",
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description: homeDescription,
    url: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return null;
}
