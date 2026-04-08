"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Header from "../../../Header";

export type ProductDetailData = {
  id: number;
  name: string;
  description: string;
  category: string;
  price?: number;
  images: string[];
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductDetail({ product }: { product: ProductDetailData }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const mainSrc = product.images[selectedImageIndex] ?? product.images[0];
  const showThumbs = product.images.length > 1;

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header />

      <main className="pt-24 pb-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to products
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="space-y-4">
              <div className="relative aspect-[4/5] max-h-[min(520px,70vh)] rounded-2xl overflow-hidden border border-border/50 bg-white">
                <Image
                  src={mainSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={mainSrc.startsWith("http")}
                />
              </div>

              {showThumbs && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border transition-all duration-200 ${
                        selectedImageIndex === index
                          ? "border-accent ring-2 ring-accent/20"
                          : "border-border/60 hover:border-accent/40"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized={image.startsWith("http")}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5 lg:pt-2">
              {product.category ? (
                <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-accent">
                  {product.category}
                </p>
              ) : null}

              <h1 className="text-foreground text-2xl lg:text-3xl font-semibold tracking-tight">
                {product.name}
              </h1>

              {typeof product.price === "number" &&
                !Number.isNaN(product.price) &&
                product.price > 0 && (
                  <p className="text-foreground/90 text-lg font-medium">
                    {formatPrice(product.price)}
                  </p>
                )}

              <p className="text-muted text-sm lg:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-accent/90 transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask me more
                </a>
              </div>

              <p className="text-muted text-xs leading-relaxed pt-4 border-t border-border/50">
                Interested in this piece? Message us for customization, timing, and availability.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
