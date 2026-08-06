"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, type Product } from "@/lib/supabase";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function parseRupiah(raw: string): number {
  const stripped = raw.replace(/[^\d]/g, "");
  return stripped ? parseInt(stripped, 10) : 0;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type SortOption = "newest" | "price_asc" | "price_desc";
type PriceMode = "all" | "under" | "range";

const UNDER_PRESETS = [
  { label: "< Rp 100.000", value: 100_000 },
  { label: "< Rp 250.000", value: 250_000 },
  { label: "< Rp 500.000", value: 500_000 },
  { label: "< Rp 1.000.000", value: 1_000_000 },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
];

const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);
const PAGE_SIZE = 15;

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters — initialized from the URL so back-navigation restores them
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") || "All"
  );
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const value = searchParams.get("sort");
    return (SORT_VALUES as string[]).includes(value ?? "") ? (value as SortOption) : "newest";
  });
  const [priceMode, setPriceMode] = useState<PriceMode>(() => {
    if (searchParams.has("priceUnder")) return "under";
    if (searchParams.has("priceMin") || searchParams.has("priceMax")) return "range";
    return "all";
  });
  const [underMax, setUnderMax] = useState<number>(() => {
    const value = parseInt(searchParams.get("priceUnder") ?? "", 10);
    return Number.isFinite(value) && value > 0 ? value : 100_000;
  });
  const [rangeMin, setRangeMin] = useState(() => searchParams.get("priceMin") ?? "");
  const [rangeMax, setRangeMax] = useState(() => searchParams.get("priceMax") ?? "");

  // Skip syncing the URL on the very first render — it already reflects this state
  const isFirstRender = useRef(true);

  // UI toggles
  const [showPricePanel, setShowPricePanel] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Pagination — 15 products at a time, more load in as the sentinel scrolls into view
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  // Keep the URL in sync with the active filters so returning from a product
  // detail page (via back navigation) restores this exact filter state.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (priceMode === "under") {
      params.set("priceUnder", String(underMax));
    } else if (priceMode === "range") {
      if (rangeMin) params.set("priceMin", rangeMin);
      if (rangeMax) params.set("priceMax", rangeMax);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [activeCategory, sortBy, priceMode, underMax, rangeMin, rangeMax, pathname, router]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const c = p.category?.trim();
      if (c) set.add(c);
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Price filter
    if (priceMode === "under") {
      list = list.filter((p) => typeof p.price === "number" && p.price < underMax);
    } else if (priceMode === "range") {
      const min = parseRupiah(rangeMin);
      const max = parseRupiah(rangeMax);
      if (min > 0 || max > 0) {
        list = list.filter((p) => {
          if (typeof p.price !== "number") return false;
          const aboveMin = min > 0 ? p.price >= min : true;
          const belowMax = max > 0 ? p.price <= max : true;
          return aboveMin && belowMax;
        });
      }
    }

    // Sort
    if (sortBy === "price_asc") {
      list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    // "newest" keeps the default created_at DESC order from the DB

    return list;
  }, [products, activeCategory, priceMode, underMax, rangeMin, rangeMax, sortBy]);

  // Reset to the first page whenever the filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, priceMode, underMax, rangeMin, rangeMax, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Latest values for the IntersectionObserver callback below, which is set up once
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const loadingMoreRef = useRef(loadingMore);
  loadingMoreRef.current = loadingMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (loadingMoreRef.current || !hasMoreRef.current) return;

        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((c) => c + PAGE_SIZE);
          setLoadingMore(false);
        }, 400);
      },
      { rootMargin: "400px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  // Active price filter label for display
  const activePriceLabel = useMemo(() => {
    if (priceMode === "under") {
      return UNDER_PRESETS.find((p) => p.value === underMax)?.label ?? `< ${formatPrice(underMax)}`;
    }
    if (priceMode === "range") {
      const min = parseRupiah(rangeMin);
      const max = parseRupiah(rangeMax);
      if (min > 0 && max > 0) return `${formatPrice(min)} – ${formatPrice(max)}`;
      if (min > 0) return `≥ ${formatPrice(min)}`;
      if (max > 0) return `≤ ${formatPrice(max)}`;
    }
    return null;
  }, [priceMode, underMax, rangeMin, rangeMax]);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Newest";

  function resetPriceFilter() {
    setPriceMode("all");
    setRangeMin("");
    setRangeMax("");
    setShowPricePanel(false);
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]" onClick={() => setShowSortDropdown(false)}>
      <Header />

      <main className="pt-28 pb-20 px-6 lg:px-10">
        <div className="w-full">

          {/* Page header */}
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

          {!loading && products.length > 0 && (
            <>
              {/* Category pills */}
              <div className="mb-5 flex flex-wrap gap-2">
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

              {/* Filter & Sort toolbar */}
              <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
                {/* Left: Price filter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPricePanel((v) => !v);
                      setShowSortDropdown(false);
                    }}
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium border transition-colors duration-200",
                      activePriceLabel
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-border/80 bg-white/80 text-muted hover:text-foreground hover:border-foreground/15",
                    ].join(" ")}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {activePriceLabel ? activePriceLabel : "Price"}
                    {activePriceLabel && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); resetPriceFilter(); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); resetPriceFilter(); } }}
                        className="ml-0.5 hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    )}
                  </button>

                  {/* Price panel */}
                  {showPricePanel && (
                    <div
                      className="absolute z-20 top-full mt-2 left-0 w-72 bg-white rounded-2xl border border-border/60 shadow-lg p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted mb-3">
                        Filter by price
                      </p>

                      {/* Under presets */}
                      <div className="space-y-1 mb-4">
                        {UNDER_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => {
                              setPriceMode("under");
                              setUnderMax(preset.value);
                              setShowPricePanel(false);
                            }}
                            className={[
                              "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors duration-150",
                              priceMode === "under" && underMax === preset.value
                                ? "bg-accent/10 text-accent font-medium"
                                : "text-muted hover:bg-[#f8f7f4] hover:text-foreground",
                            ].join(" ")}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      <div className="h-px bg-border/40 mb-4" />

                      {/* Custom range */}
                      <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted mb-2">
                        Price range
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Min"
                          value={rangeMin}
                          onFocus={() => setPriceMode("range")}
                          onChange={(e) => { setPriceMode("range"); setRangeMin(e.target.value); }}
                          className="w-full border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder-muted/50 focus:outline-none focus:border-accent/50 bg-[#f8f7f4]"
                        />
                        <span className="text-muted text-xs shrink-0">–</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Max"
                          value={rangeMax}
                          onFocus={() => setPriceMode("range")}
                          onChange={(e) => { setPriceMode("range"); setRangeMax(e.target.value); }}
                          className="w-full border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder-muted/50 focus:outline-none focus:border-accent/50 bg-[#f8f7f4]"
                        />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => setShowPricePanel(false)}
                          className="flex-1 py-2 rounded-xl text-xs font-medium bg-foreground text-[#f8f7f4] hover:bg-foreground/85 transition-colors duration-150"
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          onClick={resetPriceFilter}
                          className="flex-1 py-2 rounded-xl text-xs font-medium border border-border/60 text-muted hover:text-foreground hover:border-foreground/20 transition-colors duration-150"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Sort */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => { setShowSortDropdown((v) => !v); setShowPricePanel(false); }}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium border border-border/80 bg-white/80 text-muted hover:text-foreground hover:border-foreground/15 transition-colors duration-200"
                  >
                    Sort: {activeSortLabel}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSortDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showSortDropdown && (
                    <div className="absolute z-20 top-full mt-2 right-0 w-52 bg-white rounded-2xl border border-border/60 shadow-lg py-2 overflow-hidden">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                          className={[
                            "w-full text-left px-4 py-2.5 text-sm transition-colors duration-150",
                            sortBy === opt.value
                              ? "text-accent font-medium bg-accent/5"
                              : "text-muted hover:bg-[#f8f7f4] hover:text-foreground",
                          ].join(" ")}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Results count */}
              {!loading && !error && (
                <p className="text-muted text-xs mb-6">
                  {filteredProducts.length === 0
                    ? "No products match your filters."
                    : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
                </p>
              )}
            </>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="border border-border/50 bg-white/60 overflow-hidden animate-pulse"
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
              <p className="text-foreground text-sm font-medium">Could not load products</p>
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

          {/* Empty state — no products at all */}
          {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/80 bg-white/50 px-8 py-16 text-center">
              <p className="text-foreground text-sm font-medium">No products yet</p>
              <p className="text-muted text-sm mt-2 max-w-md mx-auto">
                Check back soon, or get in touch if you have something custom in mind.
              </p>
            </div>
          )}

          {/* Product grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-6 lg:gap-8">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div ref={sentinelRef} className="flex items-center justify-center h-16 mt-6">
                  {loadingMore && (
                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              )}
            </>
          )}

          {/* Empty state — filters returned nothing */}
          {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/80 bg-white/50 px-8 py-16 text-center">
              <p className="text-foreground text-sm font-medium">No products match your filters</p>
              <p className="text-muted text-sm mt-2">Try adjusting the price range or category.</p>
              <button
                type="button"
                onClick={() => { resetPriceFilter(); setActiveCategory("All"); setSortBy("newest"); }}
                className="mt-5 text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const id = product.id;
  if (id == null) return null;

  const href = `/products/${id}`;
  const imageSrc = product.image_urls?.[0]?.trim() || product.image_url?.trim() || "/logo/logo-red.png";

  return (
    <Link
      href={href}
      className="group block border border-border/60 bg-white overflow-hidden transition-all duration-300 hover:border-accent/35 hover:bg-accent/[0.03]"
    >
      <div className="relative aspect-[4/5] bg-[#f0efea] overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          unoptimized={imageSrc.startsWith("http")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent opacity-80 group-hover:from-foreground/15 transition-opacity duration-300" />
      </div>
      <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-2">
        {product.category ? (
          <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.14em] uppercase text-accent">
            {product.category}
          </p>
        ) : null}
        <h2 className="text-foreground text-sm sm:text-base font-semibold tracking-tight leading-snug group-hover:text-accent transition-colors duration-200">
          {product.name}
        </h2>
        <p className="text-muted text-xs sm:text-sm leading-relaxed whitespace-pre-line line-clamp-2">
          {product.description}
        </p>
        {typeof product.price === "number" && !Number.isNaN(product.price) && product.price > 0 ? (
          <p className="text-foreground/80 text-xs sm:text-sm font-medium pt-1">
            {formatPrice(product.price)}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
