import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppCTASection() {
  return (
    <section id="contact" className="py-24 lg:py-32 px-6 lg:px-8 bg-gradient-to-b from-cream/30 to-accent/5">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <div className="space-y-6">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-semibold tracking-tight leading-tight">
            Tell us your story. We'll create the art.
          </h2>
          <p className="text-muted text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Let's discuss your vision and craft something truly special together.
          </p>
        </div>
        <a
          href="https://wa.me/1234567890"
          className="inline-flex items-center gap-3 bg-accent text-white px-12 py-5 rounded-full font-medium hover:bg-accent/90 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-lg shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}