"use client";

import ResponsiveList from "@/components/shared/list/ResponsiveList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { usePosts, type Post } from "@/lib/hooks/usePosts";
import {
  POST_COLUMNS,
  postsDesktopTableConfig,
  postsMobileListConfig,
  postsMobileStateConfig,
  renderPostDetailLink,
  type PostsFilterKey,
} from "./tableConfigs";

function renderPostCard(post: Post) {
  return (
    <Card className="border-stroke bg-panel">
      <CardHeader className="flex items-start justify-between gap-3">
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-subtle">User ID: {post.userId}</p>
        <p className="line-clamp-3 text-sm text-subtle">{post.excerpt}</p>
        {renderPostDetailLink(post.id)}
      </CardContent>
    </Card>
  );
}

export default function PostsPageClient() {
  const { posts, loading, error, refetch } = usePosts();

  return (
    <section className="space-y-4" aria-labelledby="posts-title">
      <header>
        <h1 id="posts-title" className="text-display-sm font-semibold text-brand-600">
          Posts
        </h1>
        <p className="text-sm text-subtle">
          JSONPlaceholder feed with dynamic routes at /posts/[id]
        </p>
      </header>

      <ResponsiveList<Post, PostsFilterKey>
        data={posts}
        loading={loading}
        error={error}
        onRetry={refetch}
        getKey={(post) => post.id}
        columns={POST_COLUMNS}
        desktopTableConfig={postsDesktopTableConfig}
        mobileListConfig={postsMobileListConfig}
        mobileStateConfig={postsMobileStateConfig}
        renderItem={renderPostCard}
      />
    </section>
  );
}
