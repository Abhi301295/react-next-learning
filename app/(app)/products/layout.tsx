import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Static baseline so the initial HTML shell can include a meta description
 * while `[id]/page` async `generateMetadata` resolves.
 */
export const metadata: Metadata = {
  description: "Product details in the User Dashboard.",
};

export default function ProductsSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
