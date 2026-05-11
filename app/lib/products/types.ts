export type UpstreamProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  brand?: string;
  thumbnail?: string;
  images?: string[];
};

export type CatalogProduct = {
  id: number;
  title: string;
  category: string;
  price: number;
  excerpt: string;
};
