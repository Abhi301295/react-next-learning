import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Static baseline so the initial HTML shell can include a meta description
 * while `[id]/layout` async `generateMetadata` resolves.
 */
export const metadata: Metadata = {
  description: "User profile in the User Dashboard.",
};

export default function UsersSectionLayout({ children }: { children: ReactNode }) {
  return children;
}
