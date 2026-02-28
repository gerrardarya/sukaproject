"use client";

import React from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";

const easeLuxury = [0.22, 1, 0.36, 1] as const;

/** Premium stagger: calm, editorial rhythm */
const headerWrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.05,
    },
  },
};

const gridWrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18, // ✅ stagger steps 01-05
      delayChildren: 0.08,
    },
  },
};

const fadeUpSoft: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.15, ease: easeLuxury },
  },
};

const stepIn: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.985, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: easeLuxury },
  },
};

export default function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Stories",
      desc: "We begin by listening to your story",
    },
    {
      step: "02",
      title: "Curation",
      desc: "Carefully selecting premium materials",
    },
    { step: "03", title: "Design", desc: "Crafting with intention and beauty" },
    { step: "04", title: "Execution", desc: "Meticulous attention to detail" },
    { step: "05", title: "Delivery", desc: "Timely, elegant presentation" },
  ];

  return (
    <MotionConfig reducedMotion="never">
      <section
        id="process"
        className="relative py-24 lg:py-32 px-6 overflow-hidden"
      >
        {/* Premium background: soft glows + subtle texture */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-accent/6 blur-3xl" />
          <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-accent/6 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03),transparent_55%)]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* ✅ KEEP YOUR HEADER (unchanged content, just wrapped in motion) */}
          <motion.div
            className="text-center mb-14 lg:mb-16"
            variants={headerWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            data-scroll
            data-scroll-speed="0.2"
          >
            <motion.p
              variants={fadeUpSoft}
              className="text-accent text-sm font-medium tracking-[0.18em] uppercase"
            >
              Our Process
            </motion.p>

            <motion.h2
              variants={fadeUpSoft}
              className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-semibold tracking-tight"
            >
              Our Way of Creating
            </motion.h2>

            <motion.p
              variants={fadeUpSoft}
              className="mt-4 text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              A thoughtful process that transforms stories into beautiful,
              meaningful gifts.
            </motion.p>
          </motion.div>

          {/* Steps grid (staggered) */}
          <motion.div
            className="relative"
            variants={gridWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            data-scroll
            data-scroll-speed="0.3"
          >
            {/* Connector line (desktop) with reveal */}
            <div className="hidden md:block absolute left-0 right-0 top-8">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, ease: easeLuxury }}
                className="origin-center h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
              />
            </div>

            <div className="grid gap-8 md:grid-cols-5">
              {steps.map((item) => (
                <motion.div
                  key={item.step}
                  variants={stepIn}
                  className="group relative"
                >
                  <div className="relative text-center rounded-3xl border border-border/70 bg-background/55 backdrop-blur-md p-6 md:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
                    {/* Soft sheen */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute -inset-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.20),transparent_55%)]" />
                    </div>

                    {/* Step badge */}
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-accent/25 bg-accent/10 transition-colors duration-700 group-hover:bg-accent/15">
                      <span className="font-serif text-accent font-semibold tracking-wide">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg md:text-base lg:text-lg text-foreground font-medium tracking-tight">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-muted text-sm leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="mt-4 flex justify-center">
                      <span className="h-1 w-10 rounded-full bg-accent/15 transition-all duration-700 group-hover:bg-accent/70 group-hover:w-12" />
                    </div>
                  </div>

                  {/* Hover glow behind */}
                  <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100">
                    <div className="absolute inset-4 rounded-3xl bg-accent/10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom hint */}
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.15, ease: easeLuxury, delay: 0.1 }}
            className="mt-12 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 px-4 py-2 text-xs text-muted backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.06)]" >
              <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
              Crafted with intention, delivered with care
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
