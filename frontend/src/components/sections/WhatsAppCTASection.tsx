"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, ShieldCheck, Users, Lightbulb } from "lucide-react";
import { useWhatsAppNumber, buildWhatsAppUrl } from "@/lib/useWhatsAppNumber";

const steps = [
  {
    number: "01",
    icon: Lightbulb,
    title: "Tell us your needs",
    description:
      "Share your requirements — your information is handled securely and confidentially.",
  },
  {
    number: "02",
    icon: Users,
    title: "Discuss with our team",
    description:
      "We'll reach out for a short discussion to understand your goals and technical needs.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Get a tailored solution",
    description:
      "Receive a customized plan aligned with your timeline and project scope.",
  },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay } },
});

export default function WhatsAppCTASection() {
  const whatsappNumber = useWhatsAppNumber();
  const [form, setForm] = useState({ name: "", email: "", phone: "", enquiry: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate a brief send delay, then redirect to WhatsApp
    await new Promise((r) => setTimeout(r, 600));
    const msg = `Hi! I'd like to enquire.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nEnquiry:\n${form.enquiry}`;
    window.open(buildWhatsAppUrl(whatsappNumber, msg), "_blank");
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200";

  return (
    <section id="contact" className="py-24 lg:py-32 bg-[#f8f7f4]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">


        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Timeline */}
          <div className="space-y-0">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp(0)}
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-normal tracking-tight max-w-xl">
            Tell us your story. We'll create the art.
          </h2>
        </motion.div>
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === steps.length - 1;
              return (
                <motion.div
                  key={step.number}
                  className="flex gap-5"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={fadeUp(i * 0.15)}
                >
                  {/* Line + dot */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 bg-border/50 mt-2 mb-2 min-h-[40px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-10 ${isLast ? "" : ""}`}>
                    <span className="text-xs font-medium text-accent/70 tracking-widest uppercase">
                      Step {step.number}
                    </span>
                    <h3 className="text-foreground font-semibold text-lg mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right — Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp(0.2)}
            className="bg-white rounded-2xl border border-border/40 p-8 shadow-sm"
          >
            <h3 className="text-foreground font-semibold text-xl mb-1">Tell us what you need</h3>
            <p className="text-muted text-sm mb-7">We'll get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+62 ..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Enquiry */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  Enquiry <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="enquiry"
                  value={form.enquiry}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Tell us what you're looking for, the occasion, quantity, budget..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Primary button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-xl text-sm font-medium hover:bg-accent/90 transition-all duration-300 disabled:opacity-60"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : sent ? (
                  "Opening WhatsApp…"
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Talk to Us
                  </>
                )}
              </button>

              {/* Secondary — WhatsApp direct */}
              <a
                href={buildWhatsAppUrl(whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-border/50 text-foreground py-3.5 rounded-xl text-sm font-medium hover:border-accent/40 hover:text-accent transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                Or chat directly on WhatsApp
              </a>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
