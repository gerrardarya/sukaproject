"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock product data
const products = [
  {
    id: 1,
    name: "Artisan Welcome Hamper",
    description:
      "A curated selection of premium local artisan goods, thoughtfully arranged for a warm welcome.",
    category: "Signature Hamper Collection",
    image: "/product/product-1.jpeg",
    images: [
      "/product/product-1.jpeg",
      "/product/banner-1.jpeg",
      "/product/product-2.jpeg",
    ],
  },
  {
    id: 2,
    name: "Heritage Gift Collection",
    description:
      "Timeless pieces celebrating craftsmanship and tradition, perfect for meaningful moments.",
    category: "Artisan Gift Curation",
    image: "/product/product-2.jpeg",
    images: [
      "/product/product-2.jpeg",
      "/product/product-3.jpeg",
      "/product/banner-1.jpeg",
    ],
  },
  {
    id: 3,
    name: "Gentle Beginnings Set",
    description:
      "Soft, organic essentials for the newest member of the family, wrapped with love.",
    category: "Premium Baby Essential",
    image: "/product/product-3.jpeg",
    images: [
      "/product/product-3.jpeg",
      "/product/product-1.jpeg",
      "/product/product-4.jpeg",
    ],
  },
  {
    id: 4,
    name: "Executive Appreciation",
    description:
      "Sophisticated branded gifts that reflect excellence and professional gratitude.",
    category: "Corporate Gift",
    image: "/product/product-4.jpeg",
    images: [
      "/product/product-4.jpeg",
      "/product/banner-1.jpeg",
      "/product/product-2.jpeg",
    ],
  },
  {
    id: 5,
    name: "Celebration Hamper",
    description:
      "Luxurious treats and delights curated to mark special occasions with elegance.",
    category: "Signature Hamper Collection",
    image: "/product/product-1.jpeg",
    images: [
      "/product/product-1.jpeg",
      "/product/product-3.jpeg",
      "/product/banner-1.jpeg",
    ],
  },
  {
    id: 6,
    name: "Handcrafted Treasures",
    description:
      "Unique artisan pieces selected for their beauty, quality, and story.",
    category: "Artisan Gift Curation",
    image: "/product/product-2.jpeg",
    images: [
      "/product/product-2.jpeg",
      "/product/product-4.jpeg",
      "/product/product-1.jpeg",
    ],
  },
  {
    id: 7,
    name: "Nursery Essentials Bundle",
    description:
      "Premium quality baby items in soft, natural materials for gentle care.",
    category: "Premium Baby Essential",
    image: "/product/product-3.jpeg",
    images: [
      "/product/product-3.jpeg",
      "/product/banner-1.jpeg",
      "/product/product-2.jpeg",
    ],
  },
  {
    id: 8,
    name: "Corporate Recognition Set",
    description:
      "Elegant branded merchandise designed to honor achievement and partnership.",
    category: "Corporate Gift",
    image: "/product/product-4.jpeg",
    images: [
      "/product/product-4.jpeg",
      "/product/product-1.jpeg",
      "/product/product-3.jpeg",
    ],
  },
  {
    id: 9,
    name: "Seasonal Delights Hamper",
    description:
      "A carefully composed collection celebrating the finest seasonal offerings.",
    category: "Signature Hamper Collection",
    image: "/product/product-1.jpeg",
    images: [
      "/product/product-1.jpeg",
      "/product/product-2.jpeg",
      "/product/banner-1.jpeg",
    ],
  },
  {
    id: 10,
    name: "Artisan Home Collection",
    description:
      "Beautiful handmade pieces to elevate everyday living with intention.",
    category: "Artisan Gift Curation",
    image: "/product/product-2.jpeg",
    images: [
      "/product/product-2.jpeg",
      "/product/product-3.jpeg",
      "/product/product-4.jpeg",
    ],
  },
  {
    id: 11,
    name: "New Parent Care Package",
    description:
      "Thoughtful essentials for both baby and parents during precious early days.",
    category: "Premium Baby Essential",
    image: "/product/product-3.jpeg",
    images: [
      "/product/product-3.jpeg",
      "/product/banner-1.jpeg",
      "/product/product-1.jpeg",
    ],
  },
  {
    id: 12,
    name: "Leadership Excellence Gift",
    description:
      "Distinguished gifts that convey respect and appreciation for leadership.",
    category: "Corporate Gift",
    image: "/product/product-4.jpeg",
    images: [
      "/product/product-4.jpeg",
      "/product/product-2.jpeg",
      "/product/product-3.jpeg",
    ],
  },
];

const categories = [
  "All",
  "Signature Hamper Collection",
  "Artisan Gift Curation",
  "Premium Baby Essential",
  "Corporate Gift",
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const handleCategoryChange = (category: string) => {
    setIsTransitioning(true);
    setActiveCategory(category);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Content */}
      <main className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-block mb-4">
              <span className="text-accent text-sm font-medium tracking-wider uppercase">
                Explore
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground font-semibold tracking-tight mb-6">
              Our Creations
            </h1>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Each piece is thoughtfully designed with intention and care.
            </p>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Product Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Category Filter Component
function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div className="mb-12 lg:mb-16">
      <div className="mx-auto max-w-7xl">
        {/* Label row */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-muted">
            Categories
          </p>
          <p className="text-xs text-muted hidden sm:block">Tap to filter</p>
        </div>

        {/* Scroll wrapper */}
        <div className="relative">
          {/* subtle fade edges (mobile hint) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent md:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent md:hidden" />

          <div
            className="
              flex gap-2 overflow-x-auto no-scrollbar py-2
              md:justify-center md:flex-wrap md:overflow-visible
            "
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={[
                    "shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300",
                    "border backdrop-blur-md",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "bg-accent text-white border-accent shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                      : "bg-background/60 text-foreground/70 border-border hover:text-foreground hover:bg-background hover:border-foreground/10",
                  ].join(" ")}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Small helper text (mobile) */}
        <p className="mt-3 text-xs text-muted md:hidden">
          Swipe left/right to see more categories
        </p>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-background rounded-2xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
    >
      <div className="relative h-80 overflow-hidden bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
      </div>
      <div className="p-8 space-y-3">
        <div className="text-xs text-accent font-medium tracking-wider uppercase">
          {product.category}
        </div>
        <h3 className="font-serif text-2xl text-foreground font-medium leading-tight">
          {product.name}
        </h3>
        <p className="text-muted text-[15px] leading-relaxed">
          {product.description}
        </p>
      </div>
    </Link>
  );
}
