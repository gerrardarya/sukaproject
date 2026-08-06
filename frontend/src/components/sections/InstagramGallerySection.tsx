"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";

const FEED_URL = "https://feeds.behold.so/pszP1QzYlKiVMXbMm1Pr";
const PROFILE_URL = "https://www.instagram.com/custom.at.suka/";
const TILE_COUNT = 6;

// Shown while the real feed loads, and as a fallback if it can't be reached
const FALLBACK_TILES = [
  { src: "/product/product-1.jpeg", alt: "Custom hamper creation" },
  { src: "/product/product-2.jpeg", alt: "Artisan gift curation" },
  { src: "/product/product-3.jpeg", alt: "Premium baby essentials" },
  { src: "/product/product-4.jpeg", alt: "Corporate gift selection" },
  { src: "/product/banner-1.jpeg", alt: "Gift presentation" },
  { src: "/product/product-1.jpeg", alt: "Handcrafted details" },
];

type BeholdPost = {
  id: string;
  permalink: string;
  caption?: string;
  sizes?: { medium?: { mediaUrl: string } };
};

type Tile = { src: string; alt: string; href: string };

export default function InstagramGallerySection() {
  const [tiles, setTiles] = useState<Tile[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(FEED_URL)
      .then((res) => res.json())
      .then((data: { posts?: BeholdPost[] }) => {
        if (cancelled) return;
        const posts = (data.posts ?? [])
          .filter((p) => p.sizes?.medium?.mediaUrl)
          .slice(0, TILE_COUNT)
          .map((p) => ({
            src: p.sizes!.medium!.mediaUrl,
            alt: p.caption?.slice(0, 80) || "Instagram post",
            href: p.permalink,
          }));
        if (posts.length > 0) setTiles(posts);
      })
      .catch(() => {
        // Keep showing the fallback tiles
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayTiles: Tile[] =
    tiles ?? FALLBACK_TILES.map((t) => ({ ...t, href: PROFILE_URL }));

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-cream/30">
      <div className="max-w-[92rem] mx-auto">
        <div className="text-center mb-10">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-foreground text-lg font-medium hover:text-accent transition-colors duration-200"
          >
            <Instagram className="w-5 h-5" />
            Follow us on Instagram @custom.at.suka
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
          {displayTiles.map((item, index) => (
            <a
              key={item.href + index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-cream"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                unoptimized={item.src.startsWith("http")}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted text-sm">
            Want to see more? Follow us for daily inspiration and exclusive behind-the-scenes content
          </p>
        </div>
      </div>
    </section>
  );
}