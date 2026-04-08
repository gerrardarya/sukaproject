"use client";

import React from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

const headerWrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.06,
    },
  },
};

const rowWrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.12,
    },
  },
};

const fadeUpSoft: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeOut },
  },
};

const stepCard: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: easeOut,
      delay: i * 0.08,
    },
  }),
};

export default function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Stories",
      desc: "We begin by listening to your unique story to understand the recipient.",
      image:
        "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=800",
    },
    {
      num: "02",
      title: "Curation",
      desc: "Carefully sourcing premium, meaningful materials and goods.",
      image:
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800",
    },
    {
      num: "03",
      title: "Design",
      desc: "Crafting the arrangement with intention, beauty, and purpose.",
      image:
        "https://img.freepik.com/free-photo/different-presents-arrangement-high-angle_23-2149343246.jpg?t=st=1775613339~exp=1775616939~hmac=65bebd9dd453c3289bd2dd731408fde002437f0ae17b7b9b55d54a2b140b34fb&w=1480",
    },
    {
      num: "04",
      title: "Execution",
      desc: "Meticulous attention to every ribbon, fold, and detail.",
      image:
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800",
    },
    {
      num: "05",
      title: "Delivery",
      desc: "Timely, elegant presentation that leaves a lasting impression.",
      image:
        "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="process"
        className="w-full min-h-screen bg-background py-24 overflow-hidden text-foreground"
      >
        <div className="max-w-[1400px] mx-auto pl-8 pr-6 md:pl-16 md:pr-12 lg:pl-24 lg:pr-16">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
            variants={headerWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            <div className="max-w-2xl">
              <motion.span
                variants={fadeUpSoft}
                className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              >
                Our Process
              </motion.span>
              <motion.h2
                variants={fadeUpSoft}
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-semibold tracking-tight leading-tight mb-6 md:mb-0"
              >
                The art of <br className="hidden md:block" />
                creating.
              </motion.h2>
            </div>

            <motion.div
              variants={fadeUpSoft}
              className="max-w-md md:pb-2"
            >
              <p className="text-muted text-base md:text-lg leading-relaxed mb-6">
                A thoughtful journey that transforms your stories into beautiful,
                meaningful gifts for the ones you cherish.
              </p>
              <button
                type="button"
                className="group flex items-center gap-2 text-sm font-medium tracking-wide text-foreground border-b border-border pb-1 hover:text-accent hover:border-accent/50 transition-colors duration-300"
              >
                Start your custom hamper
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  →
                </motion.span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="w-full relative">
          <motion.div
            className="flex overflow-x-auto gap-6 pl-8 pr-6 md:pl-16 md:pr-12 lg:pl-24 lg:pr-16 pb-12 pt-4 snap-x snap-mandatory scroll-smooth scroll-pl-8 md:scroll-pl-16 lg:scroll-pl-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            variants={rowWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={stepCard}
                className="flex-none w-[280px] md:w-[320px] lg:w-[380px] snap-start group cursor-pointer"
              >
                <motion.div
                  className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-cream border border-border/40"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5, ease: easeOut }}
                >
                  <motion.img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.75, ease: easeOut }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </motion.div>

                <div className="flex gap-4">
                  <div className="text-xs font-semibold tracking-[0.12em] text-accent mt-1.5 tabular-nums">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed pr-4">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div
              className="flex-none w-px shrink-0 md:w-6 lg:w-10"
              aria-hidden
            />
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
