"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

type LinkItem = {
  title: string;
  subtitle: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
};

export default function LinkTreePage() {
  // ✅ Replace these with real URLs
  const instagramUrl = "https://instagram.com/yourbrand";
  const whatsappUrl =
    "https://wa.me/1234567890?text=Hi%20I%E2%80%99d%20like%20to%20consult%20about%20a%20custom%20hamper%20%E2%9C%A8";
  const websiteUrl = "/"; // or "https://yourdomain.com"

  const links: LinkItem[] = [
    {
      title: "WhatsApp Consultation",
      subtitle: "Chat with our team & start your custom hamper",
      href: whatsappUrl,
      external: true,
      highlight: true,
    },
    {
      title: "Explore Our Website",
      subtitle: "See our collections, story, and process",
      href: websiteUrl,
      external: websiteUrl.startsWith("http"),
    },
    {
      title: "Instagram",
      subtitle: "Latest creations, reels, and behind-the-scenes",
      href: instagramUrl,
      external: true,
    },
  ];

  const Card = ({ item }: { item: LinkItem }) => {
    const base =
      "group relative w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300 overflow-hidden";
    const normal =
      "border-border/80 bg-background/60 backdrop-blur-md hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(0,0,0,0.12)]";
    const highlight =
      "border-accent/25 bg-accent/10 hover:bg-accent/15 shadow-[0_12px_45px_rgba(0,0,0,0.10)]";

    return (
      <div className={`${base} ${item.highlight ? highlight : normal}`}>
        {/* subtle sheen on hover (not animation library, just CSS hover) */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -inset-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-medium text-foreground">
              {item.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/70">
              {item.subtitle}
            </p>
          </div>
          <span className="text-foreground/50 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    );
  };

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-background">
      {/* Soft premium background (static) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 py-10">
        {/* Header (no motion) */}
        <div className="text-center">
          <div className="mx-auto mb-4 h-24 w-24 p-4 rounded-full border border-border bg-background/60 backdrop-blur-md flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <Image
              src="/logo/logo-red.png"
              alt="Premium Gifting"
              width={100}
              height={5}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="font-serif text-3xl text-foreground font-semibold tracking-tight">
            Custom at Suka
          </h1>

          <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
            Custom Suka Suka dan bikin
          </p>
          <p className=" text-sm text-foreground/70 leading-relaxed">
            #DreamHampers kamu jadi kenyataan
          </p>
        </div>

        {/* Links */}
        <div className="mt-10 space-y-4 flex flex-col">
          {links.map((item) =>
            item.external ? (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                <Card item={item} />
              </a>
            ) : (
              <Link key={item.title} href={item.href}>
                <Card item={item} />
              </Link>
            ),
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 text-center">
          <p className="text-xs text-foreground/60">
            © {new Date().getFullYear()} Custom at Suka • Crafted with care
          </p>
        </div>
      </div>
    </main>
  );
}
