import React from "react";
import ScrollStack, { ScrollStackItem } from "../ScrollStack";

export default function CoreValuesSection() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-5 font-semibold tracking-tight">
            Core Values
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            The foundation of everything we create
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 text-center">
          {[
            {
              title: "Signature Art",
              desc: "Every creation is a unique work of art",
              icon: "🎨",
            },
            {
              title: "Well Made",
              desc: "Premium materials, exceptional craftsmanship",
              icon: "✨",
            },
            {
              title: "Reliably Delivered",
              desc: "Timely, elegant, and perfectly presented",
              icon: "🤝",
            },
          ].map((value, index) => (
            <div key={index} className="space-y-5 group">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h3 className="font-serif text-2xl text-foreground font-medium">
                {value.title}
              </h3>
              <p className="text-muted leading-relaxed text-[15px]">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
