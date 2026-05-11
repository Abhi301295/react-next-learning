import type { Metadata } from "next";
import PostsPageClient from "./PostsPageClient";

export const metadata: Metadata = {
  title: "Posts",
  description:
    "Browse posts with search, filters, sorting, and pagination in the dashboard.",
  alternates: {
    canonical: "/posts",
  },
};

export default function PostsPage() {
  return <PostsPageClient />;
}
