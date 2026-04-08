"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Banner = {
  id: number;
  title: string;
  description?: string | null;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

// Fallback if no banners in DB
const FALLBACK: Banner[] = [
  {
    id: 0,
    title: "Custom at Suka",
    description: null,
    image_url: "/product/banner-1.jpeg",
    is_active: true,
    sort_order: 1,
  },
];

const INTERVAL = 5000;

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>(FALLBACK);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setBanners(data);
      });
  }, []);

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent((index + banners.length) % banners.length);
    },
    [banners.length]
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, banners.length]);

  // Pause on hover
  const pauseTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resumeTimer = () => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, INTERVAL);
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  const banner = banners[current];

  return (
    <section
      className="relative w-full h-[100svh] overflow-hidden bg-black"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={banner.id + "-" + current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={banner.image_url}
            alt={banner.title || "Banner"}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        </motion.div>
      </AnimatePresence>

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 md:px-16 md:pb-20 z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={current + "-text"}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-xl"
          >
            {banner.title && (
              <h1 className="text-white text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-3 md:mb-4">
                {banner.title}
              </h1>
            )}

            {banner.description?.trim() ? (
              <p className="text-white/85 text-sm md:text-base font-medium leading-relaxed max-w-lg mb-5 md:mb-6">
                {banner.description.trim()}
              </p>
            ) : null}

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap pointer-events-auto">
              <a
                href="https://wa.me/1234567890"
                className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all duration-200 shadow-md"
              >
                Create Yours Now!
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white transition-all duration-200 border border-white/20"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white transition-all duration-200 border border-white/20"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 right-6 md:right-16 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Go to banner ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {banners.length > 1 && (
        <motion.div
          key={current + "-progress"}
          className="absolute bottom-0 left-0 h-[2px] bg-white/60 z-20"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: INTERVAL / 1000, ease: "linear" }}
        />
      )}
    </section>
  );
}
