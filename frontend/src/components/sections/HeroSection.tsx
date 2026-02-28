"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const EASE = [0.4, 0, 0.2, 1] as const;

const containerVariant: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.25,
      delay: 3.5, // overall delay before text animation starts
    },
  },
};

const textItemVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: EASE, // ✅ typed correctly
      delay: 3.5, // overall delay before text animation starts
    },
  },
};

const imageVariant: Variants = {
  hidden: { opacity: 0, x: 60, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: EASE, // ✅ typed correctly
      delay: 4.35, // starts after text sequence
    },
  },
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export const mobileContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 3.8 },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: easeOut } },
};

export const floatY: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

export default function HeroSection() {
  return (
    <section className="relative">
      {" "}
      {/* Mobile Full Screen Banner */}
      <div className="md:hidden relative overflow-hidden">
        {/* Use safe viewport height on mobile (prevents browser bar jumps) */}
        <div className="relative min-h-[100svh]">
          {/* Background image */}
          <Image
            src="/product/banner-1.jpeg"
            alt="Premium Gift Hampers"
            fill
            className="object-cover"
            priority
          />

          {/* Premium overlay: vignette + soft gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_55%)]" />

          {/* Subtle animated glow blobs */}
          <motion.div
            className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/8 blur-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [1.05, 0.95, 1.05] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <motion.div
              className="w-full px-5 pb-10 pt-24"
              variants={mobileContainer}
              initial="hidden"
              animate="show"
            >
              <div className="mx-auto max-w-[22rem]">
                {/* Eyebrow / badge */}
                <motion.div
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 backdrop-blur-md"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                  <p className="text-[11px] tracking-wide text-white/90">
                    Custom Hampers • Jakarta
                  </p>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={fadeUp}
                  className="mt-4 font-serif text-[34px] leading-[1.08] text-white font-semibold tracking-tight"
                >
                  Gifting is more than giving things — it&apos;s creating art.
                </motion.h1>

                {/* Body */}
                <motion.p
                  variants={fadeUp}
                  className="mt-4 text-[15px] leading-relaxed text-white/85"
                >
                  Every gift tells a story. We craft personalized experiences
                  that connect hearts and create lasting memories.
                </motion.p>

                {/* CTA group */}
                <motion.div variants={fadeUp} className="mt-7 space-y-3">
                  <motion.a
                    href="https://wa.me/1234567890"
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3.5 text-sm font-medium shadow-lg shadow-black/20 active:scale-[0.99]"
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  >
                    Consult via WhatsApp
                    <motion.span
                      className="inline-block opacity-70"
                      initial={{ x: 0 }}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.a>

                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  >
                    <Link
                      href="/products"
                      className="flex w-full items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md"
                    >
                      View Our Creations
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Trust line */}
                <motion.p
                  variants={floatY}
                  className="mt-5 text-[12px] text-white/70"
                >
                  Free design ideation • Curated items • Timely delivery
                </motion.p>
              </div>

              {/* Scroll hint */}
              <motion.div
                className="mt-10 flex w-full justify-center"
                variants={fadeIn}
              >
                <motion.div
                  className="flex flex-col items-center gap-2 text-white/70"
                  animate={{ y: [0, 6, 0], opacity: [0.55, 0.9, 0.55] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-[11px] tracking-wide">Scroll</span>
                  <span className="h-6 w-[2px] rounded-full bg-white/50" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Desktop Hero Section - Full Screen */}
      <div className="hidden md:block relative min-h-screen">
        <div className="absolute inset-0 bg-background/95" />

        {/* Use padding-top for navbar offset, not margin-top */}
        <div className="relative z-10 min-h-screen flex items-center pt-24 pb-16">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              {/* Text Content (staggered) */}
              <motion.div
                className="space-y-8"
                variants={containerVariant}
                initial="hidden"
                animate="show"
                data-scroll
                data-scroll-speed="0.7"
              >
                <div className="space-y-6">
                  <motion.h1
                    variants={textItemVariant}
                    className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground font-semibold tracking-tight"
                  >
                    Gifting is more than giving things — it&apos;s creating art.
                  </motion.h1>

                  <motion.p
                    variants={textItemVariant}
                    className="text-lg md:text-xl text-muted leading-relaxed max-w-xl"
                  >
                    Every gift tells a story. We craft personalized experiences
                    that connect hearts and create lasting memories.
                  </motion.p>
                </div>

                <motion.div
                  variants={textItemVariant}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.a
                    href="https://wa.me/1234567890"
                    className="bg-accent text-white px-10 py-4 rounded-full font-medium hover:bg-accent/90 hover:shadow-lg transition-all duration-300 text-center shadow-md"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    Consult via WhatsApp
                  </motion.a>

                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <Link
                      href="/products"
                      className="block bg-foreground/10 backdrop-blur-sm border-2 border-foreground/20 px-10 py-4 rounded-full font-medium hover:bg-foreground/20 hover:border-foreground/30 transition-all duration-300 text-center"
                    >
                      View Our Creations
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Image Content (starts after text finishes) */}
              <motion.div
                className="relative"
                variants={imageVariant}
                initial="hidden"
                animate="show"
                data-scroll
                data-scroll-speed="0.5"
              >
                <motion.div
                  className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-border/50 shadow-xl cursor-pointer"
                  whileHover={{ scale: 1.03, rotateY: 4, rotateX: 4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                >
                  <Image
                    src="/product/banner-1.jpeg"
                    alt="Premium Gift Hampers"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />

                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-accent/10 flex items-center justify-center opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 20,
                      }}
                      className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full"
                    >
                      <span className="text-foreground font-medium">
                        Explore Our Work
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-xl"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.75, 0.45] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/5 rounded-full blur-2xl"
                  animate={{
                    scale: [1.08, 0.92, 1.08],
                    opacity: [0.25, 0.55, 0.25],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
                <motion.div
                  className="absolute top-8 -left-8 w-4 h-4 bg-accent rounded-full"
                  animate={{ y: [-10, 10, -10], opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-12 -right-8 w-6 h-6 bg-accent/50 rounded-full"
                  animate={{
                    y: [10, -10, 10],
                    x: [-5, 5, -5],
                    opacity: [0.45, 0.75, 0.45],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      {/* If you have a separate mobile hero, keep it below */}
    </section>
  );
}
