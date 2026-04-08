"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

type DropdownItem = { label: string; href: string };
export type MobileNavItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: DropdownItem[] };

type SocialItem = { label: string; link: string };

type MobileNavProps = {
  nav: MobileNavItem[];
  socialItems: SocialItem[];
  scrolled: boolean;
};

const panelVariants = {
  closed: {
    x: "100%",
    opacity: 0.98,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const },
  },
  open: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 380, damping: 36, mass: 0.7 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.28 } },
  exit: { opacity: 0, transition: { duration: 0.22 } },
};

const listItem = {
  hidden: { opacity: 0, x: 16 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.04 + i * 0.045, duration: 0.35, ease: "easeOut" as const },
  }),
};

export default function MobileNav({
  nav,
  socialItems,
  scrolled,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /**
   * Pill background: scroll position + menu open only.
   * (Do not use header “hover” here — after closing the drawer, hover can
   * still be true and would wrongly keep the pill visible at the top.)
   */
  const showSolidBg = scrolled || open;
  const onHero = !showSolidBg;

  const overlay =
    mounted ? (
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="mobile-nav-backdrop"
              type="button"
              aria-label="Close menu"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={backdropVariants}
              className="fixed inset-0 z-[100] bg-foreground/30 backdrop-blur-[3px] lg:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="mobile-nav-panel"
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial="closed"
              animate="open"
              exit="closed"
              variants={panelVariants}
              className="fixed inset-y-0 right-0 z-[101] flex w-[min(100vw,22rem)] flex-col border-l border-border/30 bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
                <Link
                  href="/"
                  className="relative block h-9 w-28"
                  onClick={() => setOpen(false)}
                >
                  <Image
                    src="/logo/logo-red.png"
                    alt="Custom at Suka"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-[#f8f7f4] hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav
                className="flex-1 overflow-y-auto overscroll-contain px-3 py-4"
                aria-label="Main"
              >
                <ul className="space-y-1">
                  {nav.map((item, i) => {
                    if ("children" in item && item.children) {
                      const isExpanded = expanded === item.label;
                      return (
                        <motion.li
                          key={item.label}
                          custom={i}
                          initial="hidden"
                          animate="show"
                          variants={listItem}
                        >
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium text-foreground transition-colors hover:bg-[#f8f7f4]"
                            aria-expanded={isExpanded}
                            aria-controls={`subnav-${item.label.replace(/\s/g, "-")}`}
                            id={`nav-${item.label.replace(/\s/g, "-")}`}
                            onClick={() =>
                              setExpanded((c) =>
                                c === item.label ? null : item.label
                              )
                            }
                          >
                            {item.label}
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              aria-hidden
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                id={`subnav-${item.label.replace(/\s/g, "-")}`}
                                role="group"
                                aria-labelledby={`nav-${item.label.replace(/\s/g, "-")}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                  transition: {
                                    height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                                    opacity: { duration: 0.22, delay: 0.05 },
                                  },
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                  transition: {
                                    opacity: { duration: 0.15 },
                                    height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                                  },
                                }}
                                className="overflow-hidden pl-2"
                              >
                                <ul className="space-y-0.5 border-l-2 border-accent/20 py-1 pl-3">
                                  {item.children.map((child) => (
                                    <li key={child.href}>
                                      <Link
                                        href={child.href}
                                        className="block rounded-lg py-2.5 pr-2 text-sm text-muted transition-colors hover:text-accent"
                                        onClick={() => setOpen(false)}
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      );
                    }

                    return (
                      <motion.li
                        key={item.label}
                        custom={i}
                        initial="hidden"
                        animate="show"
                        variants={listItem}
                      >
                        <Link
                          href={item.href!}
                          className="block rounded-xl px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-[#f8f7f4]"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-border/50 px-5 py-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                  Follow us
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialItems.map((s) => (
                    <a
                      key={s.label}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-border/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2"
      >
        {/* Background layer: opacity-0 on hero, solid after scroll / open */}
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-0 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open
              ? "opacity-100 bg-white shadow-lg ring-1 ring-accent/30 backdrop-blur-md"
              : showSolidBg
                ? "opacity-100 bg-white/92 shadow-md ring-1 ring-border/35 backdrop-blur-md"
                : "opacity-0 bg-transparent shadow-none ring-0",
          ].join(" ")}
        />

        <span className="relative z-10 flex h-5 w-5 items-center justify-center">
          <Menu
            className={`absolute h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
            } ${onHero && !open ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" : "text-foreground"}`}
            aria-hidden
            strokeWidth={2}
          />
          <X
            className={`absolute h-5 w-5 text-foreground transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0"
            }`}
            aria-hidden
            strokeWidth={2}
          />
        </span>
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
