"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import MobileNav from "./MobileNav";

type DropdownItem = { label: string; href: string };
type NavItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: DropdownItem[] };

const NAV: NavItem[] = [
  {
    label: "Products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "Baby Hampers & Birthday", href: "/products?category=baby" },
      { label: "Corporate", href: "/products?category=corporate" },
      { label: "Packaging", href: "/products?category=packaging" },
      { label: "Wedding", href: "/products?category=wedding" },
    ],
  },
  {
    label: "How to Order",
    children: [
      { label: "Ordering guide", href: "/how-to-order" },
      { label: "Process", href: "/#process" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    label: "About Us",
    children: [
      { label: "Our Story", href: "/#story" },
      { label: "Clients", href: "/#clients" },
      { label: "Vision & Mission", href: "/#vision" },
    ],
  },
  { label: "Contact Us", href: "/#contact" },
];

const socialItems = [
  { label: "WhatsApp", link: "https://wa.me/1234567890" },
  { label: "Instagram", link: "https://www.instagram.com/custom.at.suka/" },
];

export default function Header({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always opaque on pages that don't opt-in to transparent hero behavior
  const isOpaque = !transparentOnTop || scrolled || hovered;

  const handleMenuEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isOpaque
          ? "bg-white/98 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setOpenMenu(null);
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-between items-center">
          <Link href="/" className="relative h-10 w-auto flex items-center flex-shrink-0">
            <Image
              src="/logo/logo-red.png"
              alt="Custom at Suka"
              width={100}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-1">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(item.label)}
                  onMouseLeave={handleMenuLeave}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isOpaque
                        ? "text-foreground hover:text-accent hover:bg-accent/5"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openMenu === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMenu === item.label && (
                    <div
                      className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-border/30 overflow-hidden py-1.5"
                      onMouseEnter={() => handleMenuEnter(item.label)}
                      onMouseLeave={handleMenuLeave}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:text-accent hover:bg-accent/5 transition-colors duration-150"
                          onClick={() => setOpenMenu(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isOpaque
                      ? "text-foreground hover:text-accent hover:bg-accent/5"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile: logo + burger menu */}
        <div className="relative flex lg:hidden items-center justify-between gap-3">
          <Link href="/" className="relative z-[60] flex h-10 shrink-0 items-center">
            <Image
              src="/logo/logo-red.png"
              alt="Custom at Suka"
              width={100}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
          <MobileNav nav={NAV} socialItems={socialItems} scrolled={scrolled} />
        </div>
      </div>
    </nav>
  );
}
