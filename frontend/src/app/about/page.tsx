"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useWhatsAppNumber, buildWhatsAppUrl } from "@/lib/useWhatsAppNumber";

const easeLuxury = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeLuxury, delay: i * 0.12 },
  }),
};

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "300+", label: "Happy Clients" },
  { value: "50+", label: "Corporate Partners" },
  { value: "5", label: "Years of Crafting" },
];

const missions = [
  "Listen to every story and translate it into a thoughtful, personal gift.",
  "Curate premium, meaningful products with care in every detail.",
  "Deliver memorable gifting experiences that strengthen relationships.",
];

// Defaults when nothing is configured in the admin yet
const DEFAULT_MISSION_IMAGE = "/product/product-1.jpeg";
const DEFAULT_VISION_IMAGE = "/product/product-3.jpeg";

type TeamMember = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export default function AboutPage() {
  const whatsappNumber = useWhatsAppNumber();
  const [missionImage, setMissionImage] = useState(DEFAULT_MISSION_IMAGE);
  const [visionImage, setVisionImage] = useState(DEFAULT_VISION_IMAGE);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    supabase
      .from("about_settings")
      .select("mission_image_url, vision_image_url")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.mission_image_url) setMissionImage(data.mission_image_url);
        if (data?.vision_image_url) setVisionImage(data.vision_image_url);
      });

    supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setTeam(data);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        {/* ── Our Story ── */}
        <motion.section
          id="story"
          className="max-w-3xl mx-auto px-6 text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            className="text-accent text-xs font-medium tracking-widest uppercase mb-3"
          >
            Our Story
          </motion.p>
          <motion.h1
            custom={1}
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl text-foreground font-semibold tracking-tight leading-tight mb-8"
          >
            Turning stories into
            <br />
            gifts worth remembering.
          </motion.h1>
          <motion.div
            custom={2}
            variants={fadeUp}
            className="space-y-4 text-muted text-sm md:text-base leading-relaxed"
          >
            <p>
              Custom at Suka began with a simple belief: a gift should carry a
              story, not just fill a box. What started as a small passion for
              thoughtful gifting has grown into a studio that crafts custom
              hampers for life&apos;s most meaningful moments — from newborn
              celebrations and weddings to corporate appreciation.
            </p>
          </motion.div>
        </motion.section>

        {/* ── Numbers ── */}
        <motion.section
          className="max-w-5xl mx-auto px-6 mt-20"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-border/50 divide-x divide-border/50">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                className="py-10 px-4 text-center"
              >
                <p className="text-accent text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                  {stat.value}
                </p>
                <p className="text-muted text-xs md:text-sm tracking-wide uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Our Mission: picture left, detail right ── */}
        <section className="max-w-5xl mx-auto px-6 mt-24">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="relative aspect-[4/5] overflow-hidden border border-border/40 bg-white"
            >
              <Image
                src={missionImage}
                alt="Our mission — crafting thoughtful hampers"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="text-accent text-xs font-medium tracking-widest uppercase mb-3">
                Our Mission
              </p>
              <h2 className="text-2xl md:text-3xl text-foreground font-semibold tracking-tight mb-6">
                Crafted with intention,
                <br />
                given with meaning.
              </h2>
              <ul className="space-y-4">
                {missions.map((mission) => (
                  <li
                    key={mission}
                    className="flex items-start gap-3 text-muted text-sm md:text-base leading-relaxed"
                  >
                    <span className="mt-2 w-1.5 h-1.5 bg-accent shrink-0" />
                    {mission}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ── Our Vision: detail left, picture right ── */}
        <section id="vision" className="max-w-5xl mx-auto px-6 mt-24 scroll-mt-28">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="order-2 md:order-1"
            >
              <p className="text-accent text-xs font-medium tracking-widest uppercase mb-3">
                Our Vision
              </p>
              <h2 className="text-2xl md:text-3xl text-foreground font-semibold tracking-tight mb-6">
                Every moment deserves
                <br />
                a lasting memory.
              </h2>
              <p className="text-muted text-sm md:text-base leading-relaxed">
                To be Indonesia&apos;s most trusted custom gifting brand —
                where every hamper turns a meaningful moment into a lasting
                memory, and every client feels their story has been heard,
                honored, and beautifully told.
              </p>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="order-1 md:order-2 relative aspect-[4/5] overflow-hidden border border-border/40 bg-white"
            >
              <Image
                src={visionImage}
                alt="Our vision — memorable gifting experiences"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </section>

        {/* ── Team ── */}
        <motion.section
          className="max-w-5xl mx-auto px-6 mt-24"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div custom={0} variants={fadeUp} className="text-center mb-12">
            <p className="text-accent text-xs font-medium tracking-widest uppercase mb-3">
              Our Team
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-foreground font-semibold tracking-tight">
              Crafting excellence as a team.
            </h2>
          </motion.div>

          {team.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={member.id}
                  custom={i + 1}
                  variants={fadeUp}
                  className="w-full max-w-[280px] text-center"
                >
                  <div className="relative aspect-[3/4] overflow-hidden border border-border/40 bg-white mb-4">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted/30 text-4xl font-semibold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-foreground font-semibold text-lg">
                    {member.name}
                  </h3>
                  {member.description?.trim() ? (
                    <p className="text-muted text-sm mt-1 leading-relaxed">
                      {member.description}
                    </p>
                  ) : null}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              custom={1}
              variants={fadeUp}
              className="relative aspect-[16/9] overflow-hidden border border-border/40 bg-white"
            >
              <Image
                src="/product/banner-1.jpeg"
                alt="The Custom at Suka team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </motion.div>
          )}
        </motion.section>

        {/* ── CTA ── */}
        <motion.div
          className="max-w-3xl mx-auto px-6 mt-24 text-center"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <p className="text-muted text-sm md:text-base leading-relaxed mb-6">
            Have a moment worth celebrating? Let&apos;s create your
            #DreamHampers together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={buildWhatsAppUrl(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-foreground text-[#f8f7f4] px-6 py-3 text-sm font-medium hover:bg-foreground/85 transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-border/70 text-muted px-6 py-3 text-sm font-medium hover:border-foreground/20 hover:text-foreground transition-colors duration-200"
            >
              Browse products
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
