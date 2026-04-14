"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { supabase, type Product } from "@/lib/supabase";

const easeLuxury = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: easeLuxury,
    },
  },
};

const PRODUCTS_MAX = 8;
const PLACEHOLDER = "/logo/logo-red.png";

/** Mobile (below sm): one full card + ~2.25rem peek of next */
const CARD_WIDTH_MOBILE =
  "w-[calc(100vw-3rem-0.5rem-2.25rem)] max-sm:min-w-0";
const CARD_WIDTH_SM =
  "sm:w-[calc((100vw-3rem-1rem)/3)]";
const CARD_WIDTH_LG = "lg:w-[calc((100vw-4rem-3rem)/5)]";
const CARD_WIDTH_ALL = `${CARD_WIDTH_MOBILE} ${CARD_WIDTH_SM} ${CARD_WIDTH_LG}`;

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(PRODUCTS_MAX);

    if (!error && data) {
      setProducts(data as Product[]);
    } else {
      setProducts([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showCarousel = !loading && products.length > 0;

  return (
    <section id="products" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={container}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2
            variants={fadeUp}
            className="font-serif text-4xl md:text-5xl text-foreground mb-5 font-normal tracking-tight"
          >
            For Every Moment Worth Celebrating
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-muted text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Handcrafted with love, designed to create lasting impressions.
          </motion.p>
        </motion.div>
      </div>

      <div className="w-full px-6 lg:px-8">
        {loading && (
          <div className="flex gap-2 lg:gap-3 overflow-hidden pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`snap-start shrink-0 ${CARD_WIDTH_ALL}`}>
                <div className="rounded-2xl border border-border/40 overflow-hidden bg-white/40 animate-pulse">
                  <div className="aspect-[4/5] bg-border/50" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-border/60 rounded w-3/4" />
                    <div className="h-3 bg-border/40 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-muted text-sm py-8 max-w-md mx-auto">
            Our catalogue is being updated. Visit the{" "}
            <Link href="/products" className="text-accent font-medium hover:underline">
              products page
            </Link>{" "}
            to see everything we offer.
          </p>
        )}

        {showCarousel && (
          <>
            <p className="text-xs text-muted mb-3 sm:hidden">
              Swipe for more
            </p>
            <motion.div
              className="flex gap-2 lg:gap-3 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {products.map((product) => {
                const id = product.id;
                if (id == null) return null;
                const src = product.image_url?.trim() || PLACEHOLDER;
                const remote = src.startsWith("http");

                return (
                  <motion.div
                    key={id}
                    variants={fadeUp}
                    className={`snap-start shrink-0 ${CARD_WIDTH_ALL}`}
                  >
                    <Link
                      href={`/products/${id}`}
                      className="group flex flex-col h-full overflow-hidden border border-border/40 bg-white/40 transition-colors duration-300 hover:border-accent/25"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                          src={src}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 32vw, 19vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          unoptimized={remote}
                        />
                        <div className="absolute inset-0 bg-black/[0.06] group-hover:bg-transparent transition-colors duration-500" />
                      </div>

                      <div className="px-3 py-4 lg:px-4 lg:py-5 space-y-1.5 flex-1 flex flex-col">
                        {product.category ? (
                          <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-accent line-clamp-1">
                            {product.category}
                          </p>
                        ) : null}
                        <h3 className="text-foreground text-sm lg:text-base font-semibold leading-snug tracking-tight group-hover:text-accent transition-colors duration-300 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-muted text-xs lg:text-sm leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
