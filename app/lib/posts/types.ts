export type UpstreamPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type Post = {
  id: number;
  title: string;
  userId: number;
  excerpt: string;
};
