"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { MessageSquareQuote, Sparkles, ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, type Testimonial } from "@/lib/supabase";

const easeLuxury = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeLuxury, delay: i * 0.08 },
  }),
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true })
      .then(({ data }) => {
        if (data) setTestimonials(data as Testimonial[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <header className="border-b border-border/40 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20 lg:py-24 lg:px-8">
            <h1 className="mt-10 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Testimonials &amp; Results
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted sm:text-xl">
              What our clients say, and the results we&apos;ve delivered together.
            </p>
          </div>
        </header>

        {/* Testimonials list */}
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          {loading ? (
            <div className="space-y-16 sm:space-y-20">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
                  <div className="w-full lg:w-1/2">
                    <div className="aspect-[4/3] w-full rounded-2xl bg-border/30 animate-pulse" />
                  </div>
                  <div className="w-full space-y-3 lg:w-1/2">
                    <div className="h-3 w-24 bg-border/40 rounded animate-pulse" />
                    <div className="h-4 w-full bg-border/40 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-border/40 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-border/40 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-white/50 px-8 py-20 text-center">
              <MessageSquareQuote className="h-10 w-10 text-muted/30 mb-4" />
              <p className="text-foreground text-sm font-medium">No testimonials yet</p>
              <p className="text-muted text-sm mt-2 max-w-md">
                Check back soon — client stories will appear here as they come in.
              </p>
            </div>
          ) : (
            <div className="space-y-16 sm:space-y-20 lg:space-y-24">
              {testimonials.map((testimonial, i) => (
                <motion.article
                  key={testimonial.id}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={fadeUp}
                  className={`flex flex-col gap-8 lg:items-center lg:gap-14 ${
                    i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                  } ${i > 0 ? "border-t border-border/40 pt-16 sm:pt-20 lg:pt-24" : ""}`}
                >
                  {/* Result image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-[#f0efea] shadow-sm">
                      {testimonial.result_image_url ? (
                        <Image
                          src={testimonial.result_image_url}
                          alt={`${testimonial.client_name} result`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-muted/30" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quote & details */}
                  <div className="w-full lg:w-1/2">
                    <MessageSquareQuote className="h-7 w-7 text-accent/40 mb-4" strokeWidth={1.5} />
                    <p className="text-xl sm:text-2xl leading-relaxed tracking-tight text-foreground">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    <div className="mt-6">
                      <p className="text-sm font-semibold text-foreground">{testimonial.client_name}</p>
                      {testimonial.company && (
                        <p className="text-xs text-muted mt-0.5">{testimonial.company}</p>
                      )}
                    </div>

                    {testimonial.result_text && (
                      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                        <Sparkles className="h-3 w-3" />
                        {testimonial.result_text}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
