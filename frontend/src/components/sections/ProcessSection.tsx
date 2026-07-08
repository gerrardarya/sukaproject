"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUpSoft: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeOut },
  },
};

export default function ProcessSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="process"
        className="w-full bg-background py-16 md:py-24 overflow-hidden text-foreground"
      >
        <motion.div
          variants={fadeUpSoft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Desktop: full image visible. Mobile: fixed height, swipe horizontally. */}
          <div className="overflow-x-auto md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <img
              src="/product/process.jpg"
              alt="Our process — Let's create your #DreamHampers: Discovery, Consultation, Quotation, Design, Approval, Production, and Delivery."
              className="h-[440px] w-auto max-w-none md:h-auto md:w-full md:max-w-full"
              loading="lazy"
              draggable={false}
            />
          </div>

          <p className="mt-4 px-8 text-center text-xs tracking-[0.15em] uppercase text-muted md:hidden">
            Swipe to explore →
          </p>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
