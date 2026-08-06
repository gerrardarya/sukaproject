"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Instagram, ChevronDown } from "lucide-react";
import { useWhatsAppNumber, buildWhatsAppUrl } from "@/lib/useWhatsAppNumber";

const sections = [
  {
    title: "Products",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Baby Hampers & Birthday", href: "/products?category=baby" },
      { label: "Corporate", href: "/products?category=corporate" },
      { label: "Packaging", href: "/products?category=packaging" },
      { label: "Wedding", href: "/products?category=wedding" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Clients", href: "/#clients" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Vision & Mission", href: "/about#vision" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

function BrandBlock() {
  const whatsappNumber = useWhatsAppNumber();

  return (
    <div className="max-w-sm">
      <Link href="/" className="inline-flex items-center">
        <Image
          src="/logo/logo-red.png"
          alt="Custom at Suka"
          width={140}
          height={37}
          className="object-contain"
        />
      </Link>

      <p className="mt-5 text-muted text-sm leading-relaxed">
        Make your dream hampers come true.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <a
          href="https://www.instagram.com/custom.at.suka/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-muted hover:text-accent transition-colors duration-300"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <a
          href={buildWhatsAppUrl(whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="text-muted hover:text-accent transition-colors duration-300"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      <p className="mt-8 text-muted text-sm">
        © {new Date().getFullYear()} Custom at Suka. Thoughtful hampers &amp;
        custom gifts.
      </p>
    </div>
  );
}

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-muted text-sm hover:text-accent transition-colors duration-300"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* ── Mobile: accordions first, brand below ── */}
        <div className="md:hidden">
          <div className="divide-y divide-border border-b border-border">
            {sections.map((section) => (
              <details key={section.title} className="group">
                <summary className="flex items-center justify-between py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                    {section.title}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="pb-6">
                  <LinkList links={section.links} />
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10">
            <BrandBlock />
          </div>
        </div>

        {/* ── Desktop: brand left, link columns right ── */}
        <div className="hidden md:flex justify-between gap-8">
          <BrandBlock />

          <div className="flex gap-16 lg:gap-24">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-foreground text-xs font-semibold tracking-[0.15em] uppercase mb-5">
                  {section.title}
                </h4>
                <LinkList links={section.links} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
