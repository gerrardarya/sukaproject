import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

const easeLuxury = [0.22, 1, 0.36, 1] as const;
// smoother, luxury cubic-bezier

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25, // slower stagger
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
      duration: 1.2, // slower reveal
      ease: easeLuxury,
    },
  },
};
export default function FeaturedProductsSection() {
  const products = [
    {
      src: "/product/product-1.jpeg",
      title: "Signature Hamper Collection",
      desc: "Luxurious personalized gift baskets",
    },
    {
      src: "/product/product-2.jpeg",
      title: "Artisan Gift Curation",
      desc: "Thoughtfully curated premium gifts",
    },
    {
      src: "/product/product-3.jpeg",
      title: "Premium Baby Essentials",
      desc: "Gentle gifts for new beginnings",
    },
    {
      src: "/product/product-4.jpeg",
      title: "Corporate Gift Selection",
      desc: "Professional branded merchandise",
    },
  ];

  return (
    <section id="products" className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Animation */}
        <motion.div
          className="text-center mb-20"
          variants={container}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2
            variants={fadeUp}
            className="font-serif text-4xl md:text-5xl text-foreground mb-5 font-semibold tracking-tight"
          >
            Our Creations
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-muted text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Handcrafted with love, designed to create unforgettable moments
          </motion.p>
        </motion.div>

        {/* Product Grid Animation */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 lg:gap-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {products.map((product, index) => (
            <motion.div key={index} variants={fadeUp}>
              <Link
                href={`/products/${index + 1}`}
                className="group overflow-hidden rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-2xl bg-background block"
              >
                <div className="relative h-[350px] lg:h-[420px] overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.src}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                </div>

                <div className="p-8 space-y-3">
                  <h3 className="font-serif text-2xl text-foreground font-medium group-hover:text-accent transition-colors duration-300">
                    {product.title}
                  </h3>

                  <p className="text-muted text-[15px] leading-relaxed">
                    {product.desc}
                  </p>

                  <div className="pt-2">
                    <motion.span
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.25 }}
                      className="text-accent text-sm font-medium inline-flex items-center gap-2"
                    >
                      Explore Collection →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
