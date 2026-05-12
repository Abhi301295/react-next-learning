import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import { httpErrPublicMessage } from "@/lib/server-upstream";
import { fetchProductById } from "@/lib/products/server";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const r = await fetchProductById(id);
  if (r.ok) {
    return <ProductDetail product={r.product} />;
  }
  if (r.kind === "not_found" || r.kind === "invalid") {
    notFound();
  }
  throw new Error(httpErrPublicMessage(r.cause));
}
