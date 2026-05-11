import type { Metadata } from "next";
import PostsPageClient from "./PostsPageClient";

export const metadata: Metadata = {
  title: "Posts",
  description: "Browse posts from JSONPlaceholder with search, filters, and pagination.",
  alternates: {
    canonical: "/posts",
  },
};

export default function PostsPage() {
  return <PostsPageClient />;
}
