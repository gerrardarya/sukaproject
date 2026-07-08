"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Forum, Cormorant_Garamond } from "next/font/google";
import { ArrowLeft, MessageCircle, ChevronRight, Package, Sparkles } from "lucide-react";
import Header from "../../../Header";
import Footer from "../../../Footer";

const forum = Forum({ subsets: ["latin"], weight: "400" });
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export type ProductDetailData = {
  id: number;
  name: string;
  description: string;
  category: string;
  price?: number;
  images: string[];
};

export type RelatedProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductDetail({
  product,
  relatedProducts = [],
}: {
  product: ProductDetailData;
  relatedProducts?: RelatedProduct[];
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const mainSrc = product.images[selectedImageIndex] ?? product.images[0];
  const showThumbs = product.images.length > 1;

  const waMessage = encodeURIComponent(
    `Halo, saya tertarik dengan produk "${product.name}". Bisa ceritakan lebih lanjut?`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />

      <main className="flex-1 pt-24 pb-24 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">

          {/* Back button */}
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to catalogue
          </Link>

          {/* Breadcrumb */}
          <nav className="mb-10 flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-accent transition-colors duration-200">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <Link href="/products" className="hover:text-accent transition-colors duration-200">
              Products
            </Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className="text-foreground/60 truncate max-w-[180px]">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">

            {/* ── Left: Image gallery ── */}
            <div className="space-y-3">
              <div className="relative aspect-[4/5] overflow-hidden border border-border/40 bg-white">
                <Image
                  src={mainSrc}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  unoptimized={mainSrc.startsWith("http")}
                />
              </div>

              {showThumbs && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={[
                        "relative shrink-0 w-[72px] h-[72px] overflow-hidden border-2 transition-all duration-200",
                        selectedImageIndex === index
                          ? "border-accent"
                          : "border-transparent opacity-60 hover:opacity-100 hover:border-accent/40",
                      ].join(" ")}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="72px"
                        unoptimized={image.startsWith("http")}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Product info (sticky on desktop) ── */}
            <div className="lg:sticky lg:top-28 space-y-0">

              {/* Product name */}
              <h1
                className={`${forum.className} text-foreground text-3xl lg:text-[2.4rem] font-normal tracking-tight leading-[1.25] mb-5`}
              >
                {product.name}
              </h1>

              {/* Price */}
              {typeof product.price === "number" &&
                !Number.isNaN(product.price) &&
                product.price > 0 && (
                  <div className="mb-6">
                    <p className="text-accent text-[1.6rem] font-semibold tracking-tight">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-muted text-xs mt-1.5 leading-relaxed">
                      Starting price · final price may vary based on customization
                    </p>
                  </div>
                )}

              <div className="h-px bg-border/50 my-6" />

              {/* Description */}
              <div className="mb-6">
                <h2
                  className={`${cormorantGaramond.className} text-foreground text-base font-bold tracking-[0.12em] uppercase mb-3`}
                >
                  About this piece
                </h2>
                <p className="text-muted text-sm lg:text-[0.9rem] leading-[1.8] whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="h-px bg-border/50 my-6" />

              {/* Highlights */}
              <div className="mb-7 space-y-3.5">
                <div className="flex items-start gap-3 text-sm text-muted">
                  <Package className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                  <span>Custom packaging included with every order</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted">
                  <Sparkles className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                  <span>Fully customizable — tell us your vision and we'll bring it to life</span>
                </div>
              </div>

              {/* Primary CTA */}
              <a
                href={`https://wa.me/6281234567890?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full bg-foreground text-[#f8f7f4] px-6 py-3.5 rounded-2xl text-sm font-medium hover:bg-foreground/85 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp
              </a>

              {/* Footer note */}
              <p className="text-muted/60 text-[11px] leading-relaxed text-center mt-5 px-2">
                Have questions about customization, timing, or availability?<br />
                We&apos;re happy to chat — no commitment required.
              </p>
            </div>
          </div>

          {/* ── You may also like ── */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 lg:mt-28">
              <h2 className="text-foreground text-xl lg:text-2xl font-semibold tracking-tight mb-8">
                You may also like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="group block border border-border/60 bg-white overflow-hidden transition-all duration-300 hover:border-accent/35 hover:bg-accent/[0.03]"
                  >
                    <div className="relative aspect-[4/5] bg-[#f0efea] overflow-hidden">
                      <Image
                        src={item.imageUrl || "/logo/logo-red.png"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        unoptimized={item.imageUrl.startsWith("http")}
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h3 className="text-foreground text-sm font-semibold tracking-tight leading-snug line-clamp-1 group-hover:text-accent transition-colors duration-200">
                        {item.name}
                      </h3>
                      {item.price > 0 ? (
                        <p className="text-foreground/80 text-sm font-medium">
                          {formatPrice(item.price)}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
