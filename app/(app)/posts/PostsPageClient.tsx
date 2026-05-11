"use client";

import ResponsiveList from "@/components/shared/list/ResponsiveList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { usePosts } from "@/lib/hooks/usePosts";
import type { Post } from "@/lib/posts/types";
import { postsMobileStateConfig, renderPostDetailLink } from "./tableConfigs";

function renderPostCard(post: Post) {
  return (
    <Card className="border-stroke bg-panel">
      <CardHeader className="flex items-start justify-between gap-3">
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-subtle">Post ID: {post.id}</p>
        <p className="text-sm text-subtle">User ID: {post.userId}</p>
        <p className="line-clamp-3 text-sm text-subtle">{post.excerpt}</p>
        {renderPostDetailLink(post.id)}
      </CardContent>
    </Card>
  );
}

export default function PostsPageClient() {
  const {
    posts,
    mobilePosts,
    loading,
    loadingMore,
    error,
    refetch,
    postColumns,
    desktopTableConfig,
    mobileListConfig,
  } = usePosts();

  return (
    <section className="space-y-4" aria-labelledby="posts-title">
      <header>
        <h1 id="posts-title" className="text-display-sm font-semibold text-primary">
          Posts
        </h1>
        <p className="text-sm text-subtle">
          JSONPlaceholder feed with dynamic routes at /posts/[id]
        </p>
      </header>

      <ResponsiveList<Post, "userId">
        data={posts}
        mobileData={mobilePosts}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        onRetry={refetch}
        getKey={(post) => post.id}
        columns={postColumns}
        desktopTableConfig={desktopTableConfig}
        mobileListConfig={mobileListConfig}
        mobileStateConfig={postsMobileStateConfig}
        renderItem={renderPostCard}
      />
    </section>
  );
}
