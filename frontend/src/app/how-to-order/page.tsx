import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StepCard from "@/components/how-to-order/StepCard";
import FAQItem from "@/components/how-to-order/FAQItem";
import { ClipboardList, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    step: "01",
    title: "Tell us your needs",
    description:
      "Share your requirements — your information is secure and confidential.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "Talk to our team",
    description:
      "We'll contact you for a quick discussion to understand your goals and scope.",
    icon: MessageCircle,
  },
  {
    step: "03",
    title: "Get your solution",
    description:
      "Receive a tailored plan and we start building your project.",
    icon: Sparkles,
  },
] as const;

const FAQS = [
  {
    question: "How long does it take to start?",
    answer:
      "After we receive your brief, we usually schedule an intro call within 1–2 business days. Kickoff timing depends on scope and availability, and we always confirm a clear timeline before work begins.",
  },
  {
    question: "Do you offer custom solutions?",
    answer:
      "Yes. Every engagement is tailored to your goals — from custom gifting and hampers to branded packaging and one-off projects. Tell us what you need and we'll propose a fit-for-purpose approach.",
  },
  {
    question: "How do payments work?",
    answer:
      "We typically use a deposit to secure your slot, with the remainder tied to agreed milestones or delivery. You'll receive a simple breakdown in your proposal so there are no surprises.",
  },
  {
    question: "Can I request changes during development?",
    answer:
      "Absolutely. We build in feedback rounds at key stages. Smaller tweaks are part of the process; larger scope changes may be quoted separately so we stay fair and transparent.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "For digital work we use modern, reliable tools — including Next.js and React for web experiences, and Supabase or similar when a backend is needed. For physical products, we focus on quality materials and trusted production partners.",
  },
] as const;

export default function HowToOrderPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header />

      <main>
        {/* How to order (intro + process combined) */}
        <section
          className="border-b border-border/40 bg-white/60 backdrop-blur-sm"
          aria-labelledby="how-to-order-heading"
        >
          <div className="mx-auto max-w-3xl px-6 pt-16 text-center sm:pt-20 lg:pt-24 lg:px-8">
            <h1
              id="how-to-order-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              How to Order
            </h1>
            <p className="mt-4 text-lg text-muted sm:text-xl">
              Simple process to get your project started with Custom at Suka
            </p>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Whether you need a custom hamper, corporate gifting, or a digital
              experience, we keep ordering straightforward — three steps from
              first message to a plan you can act on.
            </p>
          </div>

          <div className="mx-auto max-w-5xl px-6 pb-16 sm:pb-20 lg:px-8 lg:pb-24">
            <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-5 lg:mt-14 lg:gap-6">
              {STEPS.map((item) => (
                <StepCard
                  key={item.step}
                  step={item.step}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-accent/90 hover:shadow-md"
              >
                Start a conversation
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-border/80 bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/40 hover:text-accent"
              >
                Browse products
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="scroll-mt-24 border-t border-border/40 bg-white/50 py-16 sm:py-20 lg:py-24"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="text-center">
              <h2
                id="faq-heading"
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Frequently asked questions
              </h2>
              <p className="mt-3 text-sm text-muted sm:text-base">
                Quick answers to common questions. Reach out anytime if you need
                more detail.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-border/60 bg-white px-5 shadow-sm sm:px-8">
              {FAQS.map((faq, index) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  defaultOpen={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
