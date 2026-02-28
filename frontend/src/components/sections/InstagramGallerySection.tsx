import React from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";

export default function InstagramGallerySection() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-cream/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent text-sm font-medium tracking-wider uppercase">Follow Our Journey</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-5 font-semibold tracking-tight">
            @custom.at.suka
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Get inspired by our latest creations and behind-the-scenes moments
          </p>
          <a
            href="https://www.instagram.com/custom.at.suka/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <Instagram className="w-5 h-5" />
            Follow on Instagram
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { src: "/product/product-1.jpeg", alt: "Custom hamper creation" },
            { src: "/product/product-2.jpeg", alt: "Artisan gift curation" },
            { src: "/product/product-3.jpeg", alt: "Premium baby essentials" },
            { src: "/product/product-4.jpeg", alt: "Corporate gift selection" },
            { src: "/product/banner-1.jpeg", alt: "Gift presentation" },
            { src: "/product/product-1.jpeg", alt: "Handcrafted details" }
          ].map((item, index) => (
            <a
              key={index}
              href="https://www.instagram.com/custom.at.suka/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-cream"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted text-sm">
            Want to see more? Follow us for daily inspiration and exclusive behind-the-scenes content
          </p>
        </div>
      </div>
    </section>
  );
}