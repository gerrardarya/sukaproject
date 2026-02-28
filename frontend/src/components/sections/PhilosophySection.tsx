import React from "react";
import { motion, type Variants } from "framer-motion";

const easeLuxury = [0.22, 1, 0.36, 1] as const;

const sectionWrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.15,
    },
  },
};

const fadeUpSoft: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.15, ease: easeLuxury },
  },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.98, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: easeLuxury },
  },
};

const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: { y: -10, scale: 1.03 },
};

export default function PhilosophySection() {
  const principles = [
    {
      icon: "✨",
      title: "Story",
      description:
        "Every gift begins with understanding your unique story. We listen deeply to craft experiences that resonate with your authentic self.",
      color: "from-accent/5 to-accent/10",
      shadowColor: "shadow-accent/20",
    },
    {
      icon: "🤍",
      title: "Care",
      description:
        "Attention to every detail, from sourcing premium materials to ensuring perfect presentation. Quality is our quiet promise.",
      color: "from-background to-accent/5",
      shadowColor: "shadow-accent/10",
    },
    {
      icon: "💛",
      title: "Heart",
      description:
        "We believe in the power of thoughtful giving. Each creation is made with intention, designed to touch hearts and create joy.",
      color: "from-accent/10 to-background",
      shadowColor: "shadow-accent/15",
    },
  ];

  return (
    <section
      id="philosophy"
      className="py-24 lg:py-32 px-6 lg:px-8 bg-cream/60 relative overflow-hidden"
    >
      {/* Decorative elements (slow ambient motion) */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        animate={{ scale: [1.06, 0.95, 1.06], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Header (whileInView) */}
        <motion.div
          className="text-center mb-20"
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.45 }}
        >
          <motion.div variants={fadeUpSoft} className="inline-block mb-4">
            <span className="text-accent text-sm font-medium tracking-wider uppercase">
              Our Philosophy
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUpSoft}
            className="font-serif text-4xl md:text-5xl text-foreground font-semibold tracking-tight mb-6"
          >
            Guiding Principles
          </motion.h2>

          <motion.p
            variants={fadeUpSoft}
            className="text-muted text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Three fundamental principles that shape every creation we make
          </motion.p>
        </motion.div>

        {/* Card Stack Layout */}
        <div className="relative max-w-4xl mx-auto">
          {/* Background cards (reveal + gentle float) */}
          <div className="hidden md:block absolute inset-0">
            <motion.div
              initial={{ opacity: 0, y: 16, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, ease: easeLuxury, delay: 0.1 }}
              className="absolute top-8 left-8 w-full h-80 bg-accent/5 rounded-3xl border border-accent/10 shadow-lg"
            />
            <motion.div
              initial={{ opacity: 0, y: 12, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: -1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, ease: easeLuxury, delay: 0.2 }}
              className="absolute top-4 left-4 w-full h-80 bg-accent/10 rounded-3xl border border-accent/20 shadow-lg"
            />
          </div>

          {/* Desktop cards (staggered whileInView) */}
          <motion.div
            className="relative hidden md:grid md:grid-cols-3 gap-8 lg:gap-12"
            variants={sectionWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            {principles.map((p, index) => (
              <motion.div
                key={p.title}
                variants={cardIn}
                custom={index}
                style={{
                  transform: `translateY(${index * 20}px)`,
                  zIndex: 10 - index,
                }}
              >
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  variants={hoverLift as any}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 22,
                    mass: 0.9,
                  }}
                  className="group relative"
                >
                  <div
                    className={`relative bg-gradient-to-br ${p.color} rounded-3xl border border-border p-8 h-80 shadow-xl ${p.shadowColor} transition-all duration-500 group-hover:shadow-2xl`}
                  >
                    {/* Icon (soft pop on reveal + hover) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 1.0,
                        ease: easeLuxury,
                        delay: 0.15,
                      }}
                      className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/30 transition-colors duration-300"
                    >
                      <motion.span
                        className="text-4xl"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.45, ease: easeLuxury }}
                      >
                        {p.icon}
                      </motion.span>
                    </motion.div>

                    {/* Content */}
                    <div className="text-center space-y-4">
                      <h3 className="font-serif text-2xl text-foreground font-semibold group-hover:text-accent transition-colors duration-300">
                        {p.title}
                      </h3>
                      <p className="text-muted leading-relaxed text-[15px] group-hover:text-foreground/80 transition-colors duration-300">
                        {p.description}
                      </p>
                    </div>

                    {/* Hover indicator (slow fade) */}
                    <motion.div
                      className="absolute bottom-4 left-1/2 -translate-x-1/2"
                      initial={{ opacity: 0, y: 6 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: easeLuxury }}
                    >
                      <div className="w-8 h-1 bg-accent rounded-full" />
                    </motion.div>

                    {/* Soft sheen on hover */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 rounded-3xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.6, ease: easeLuxury }}
                    >
                      <div className="absolute -inset-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.20),transparent_55%)]" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile cards (staggered whileInView) */}
          <motion.div
            className="md:hidden space-y-6"
            variants={sectionWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {principles.map((p) => (
              <motion.div
                key={p.title}
                variants={cardIn}
                className={`group relative bg-gradient-to-br ${p.color} rounded-3xl border border-border p-6 shadow-xl transition-all duration-300`}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-accent/30 transition-colors duration-300">
                    <span className="text-3xl">{p.icon}</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-xl text-foreground font-semibold group-hover:text-accent transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-muted leading-relaxed text-sm group-hover:text-foreground/80 transition-colors duration-300">
                      {p.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
