"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, type Product } from "@/lib/supabase";

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setProducts([]);
    } else {
      setProducts((data as Product[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const c = p.category?.trim();
      if (c) set.add(c);
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header />

      <main className="pt-28 pb-20 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-12 lg:mb-14 max-w-2xl">
            <p className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-3">
              Catalogue
            </p>
            <h1 className="text-foreground text-3xl md:text-4xl font-semibold tracking-tight">
              Our Creations
            </h1>
            <p className="mt-3 text-muted text-sm md:text-base leading-relaxed">
              Pieces from our studio — updated as we add new work.
            </p>
          </header>

          {/* Categories */}
          {!loading && products.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={[
                      "rounded-full px-4 py-2 text-xs font-medium transition-colors duration-200",
                      "border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f7f4]",
                      active
                        ? "border-foreground/20 bg-foreground text-[#f8f7f4]"
                        : "border-border/80 bg-white/80 text-muted hover:text-foreground hover:border-foreground/15",
                    ].join(" ")}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/50 bg-white/60 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/5] bg-border/40" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-16 bg-border/60 rounded" />
                    <div className="h-5 w-3/4 bg-border/60 rounded" />
                    <div className="h-3 w-full bg-border/40 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-border/60 bg-white px-6 py-10 text-center">
              <p className="text-foreground text-sm font-medium">
                Could not load products
              </p>
              <p className="text-muted text-sm mt-2">{error}</p>
              <button
                type="button"
                onClick={() => loadProducts()}
                className="mt-6 text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/80 bg-white/50 px-8 py-16 text-center">
              <p className="text-foreground text-sm font-medium">
                No products yet
              </p>
              <p className="text-muted text-sm mt-2 max-w-md mx-auto">
                Check back soon, or get in touch if you have something custom in mind.
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading &&
            !error &&
            products.length > 0 &&
            filteredProducts.length === 0 && (
              <p className="text-center text-muted text-sm py-16">
                No items in this category.
              </p>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const id = product.id;
  if (id == null) return null;

  const href = `/products/${id}`;
  const imageSrc =
    product.image_url?.trim() || "/logo/logo-red.png";

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-border/60 bg-white overflow-hidden transition-all duration-300 hover:border-accent/35 hover:bg-accent/[0.03]"
    >
      <div className="relative aspect-[4/5] bg-[#f0efea] overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          unoptimized={imageSrc.startsWith("http")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent opacity-80 group-hover:from-foreground/15 transition-opacity duration-300" />
      </div>
      <div className="p-5 space-y-2">
        {product.category ? (
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-accent">
            {product.category}
          </p>
        ) : null}
        <h2 className="text-foreground text-base font-semibold tracking-tight leading-snug group-hover:text-accent transition-colors duration-200">
          {product.name}
        </h2>
        <p className="text-muted text-sm leading-relaxed line-clamp-2">
          {product.description}
        </p>
        {typeof product.price === "number" && !Number.isNaN(product.price) ? (
          <p className="text-foreground/80 text-sm font-medium pt-1">
            {formatPrice(product.price)}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
