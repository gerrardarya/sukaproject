import { notFound } from "next/navigation";
import ProductDetail from "@/components/feature/product/components/ProductDetail";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data } = await supabase
    .from("products")
    .select("id")
    .eq("is_active", true);

  return (data ?? []).map((row: { id: number }) => ({
    id: String(row.id),
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (Number.isNaN(productId)) notFound();

  const { data: row, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !row) notFound();

  const imageUrl = typeof row.image_url === "string" ? row.image_url.trim() : "";
  const images = imageUrl ? [imageUrl] : ["/logo/logo-red.png"];

  const product = {
    id: row.id as number,
    name: row.name as string,
    description: row.description as string,
    category: (row.category as string) || "",
    price: typeof row.price === "number" ? row.price : 0,
    images,
  };

  return <ProductDetail product={product} />;
}
