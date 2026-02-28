"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Header from "../../../Header";

const products = [
  {
    id: 1,
    name: "Artisan Welcome Hamper",
    description:
      "A curated selection of premium local artisan goods, thoughtfully arranged for a warm welcome.",
    category: "Signature Hamper Collection",
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
    images: [
      "/product/product-4.jpeg",
      "/product/product-2.jpeg",
      "/product/product-3.jpeg",
    ],
  },
];

function ProductDetail({ product }: { product: (typeof products)[0] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Product Detail */}
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors duration-300 font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-border/50 shadow-xl">
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-300"
                  priority
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
              </div>

              {/* Image Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-accent shadow-md"
                        : "border-border/50 hover:border-accent/50"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6 lg:pt-8">
              {/* Category */}
              <div className="text-xs text-accent font-medium tracking-wider uppercase">
                {product.category}
              </div>

              {/* Product Name */}
              <h1 className="font-serif text-3xl lg:text-4xl text-foreground font-semibold tracking-tight">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-muted text-lg leading-relaxed">
                {product.description}
              </p>

              {/* WhatsApp CTA */}
              <div className="pt-4">
                <a
                  href="https://wa.me/1234567890"
                  className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-full font-medium hover:bg-accent/90 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-center shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  Ask Me More
                </a>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-muted">
                  Interested in this creation? Send me a message to learn more
                  about customization options, pricing, and availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;
