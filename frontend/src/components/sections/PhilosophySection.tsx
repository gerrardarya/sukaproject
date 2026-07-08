"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Sparkles, Handshake, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

const easeLuxury = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeLuxury, delay: i * 0.12 },
  }),
};

const principles = [
  {
    icon: Sparkles,
    title: "Story First",
    description:
      "Every gift begins with your story. We listen deeply to craft something that truly resonates.",
  },
  {
    icon: Heart,
    title: "Made with Care",
    description:
      "From material sourcing to final presentation — every detail is handled with love and intention.",
  },
  {
    icon: Handshake,
    title: "Built on Trust",
    description:
      "We build lasting relationships through honest craftsmanship and reliable delivery, every time.",
  },
];

type Client = {
  id: number;
  name: string;
  logo_url: string | null;
};

export default function PhilosophySection() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    supabase
      .from("clients")
      .select("id, name, logo_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setClients(data);
      });
  }, []);
  return (
    <section id="philosophy" className="py-24 lg:py-32 bg-[#f8f7f4]">

      {/* ── Principles ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            className="text-accent text-xs font-medium tracking-widest uppercase mb-3"
          >
            Our Philosophy
          </motion.p>
          <motion.h2
            custom={1}
            variants={fadeUp}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-normal tracking-tight"
          >
            Why Custom at Suka?
          </motion.h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="group bg-white rounded-2xl border border-border/40 px-8 py-10 hover:border-accent/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="text-foreground font-semibold text-lg mb-3 group-hover:text-accent transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {p.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Client Ticker ── */}
      {clients.length > 0 && (
        <div
          id="clients"
          className="mt-24 border-t border-b border-border/30 py-10 overflow-hidden scroll-mt-24"
        >
          {/* Label */}
          <p className="text-center text-xs font-medium tracking-widest uppercase text-muted/60 mb-8">
            Trusted by
          </p>

          {/* Scrolling track — two identical rows animate together for a seamless loop.
              The client list is repeated until each row is wider than the viewport,
              and each row carries a trailing pr-12 so the seam matches the gap. */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex gap-12 pr-12 items-center shrink-0"
                style={{
                  animation: `ticker-scroll ${
                    Math.max(1, Math.ceil(10 / clients.length)) *
                    clients.length *
                    2.5
                  }s linear infinite`,
                }}
              >
                {Array.from({
                  length: Math.max(1, Math.ceil(10 / clients.length)),
                })
                  .flatMap(() => clients)
                  .map((client, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center flex-shrink-0 min-w-[120px] opacity-50 hover:opacity-90 transition-opacity duration-300"
                    >
                      <ClientLogo name={client.name} logo={client.logo_url} />
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <style>{`
            @keyframes ticker-scroll {
              from { transform: translateX(0); }
              to   { transform: translateX(-100%); }
            }
            @media (prefers-reduced-motion: reduce) {
              @keyframes ticker-scroll {
                from, to { transform: translateX(0); }
              }
            }
          `}</style>
        </div>
      )}

    </section>
  );
}

function ClientLogo({ name, logo }: { name: string; logo: string | null }) {
  if (logo) {
    return (
      <div className="relative h-8 w-24">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
          sizes="96px"
        />
      </div>
    );
  }
  return (
    <span className="text-sm font-semibold text-foreground/60 tracking-wide whitespace-nowrap flex items-center gap-2">
      <Star className="w-3 h-3 text-accent/50" strokeWidth={2} />
      {name}
    </span>
  );
}
