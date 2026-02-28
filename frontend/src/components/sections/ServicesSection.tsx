import React from "react";

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 lg:py-32 px-6 lg:px-8 bg-cream/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-5 font-semibold tracking-tight">What We Do</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Curated experiences for every occasion, crafted with premium attention to detail.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {[
            {
              title: "Signature Hampers",
              desc: "Luxurious, personalized gift baskets combining premium items with thoughtful curation.",
              icon: "🎁"
            },
            {
              title: "Baby Hampers",
              desc: "Gentle, beautiful gifts celebrating new beginnings with soft, high-quality essentials.",
              icon: "👶"
            },
            {
              title: "Corporate Merchandise",
              desc: "Professional, branded gifts that reflect your company's values and culture.",
              icon: "🏢"
            }
          ].map((service, index) => (
            <div key={index} className="bg-background rounded-2xl p-10 border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="text-5xl mb-7 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <h3 className="font-serif text-2xl text-foreground mb-4 font-medium">{service.title}</h3>
              <p className="text-muted leading-relaxed text-[15px]">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}