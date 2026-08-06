"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useWhatsAppNumber, buildWhatsAppUrl } from "@/lib/useWhatsAppNumber";

const FALLBACK_IMAGE = "/product/banner-1.jpeg";

export default function FindUsSection() {
  const whatsappNumber = useWhatsAppNumber();
  const [image, setImage] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    supabase
      .from("about_settings")
      .select("showroom_image_url")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        const url = data?.showroom_image_url?.trim();
        if (url) setImage(url);
      });
  }, []);

  return (
    <section className="bg-[#f8f7f4]">
      <div className="grid lg:grid-cols-2 items-stretch min-h-[600px] lg:min-h-[720px]">
        {/* Text — left */}
        <div className="flex flex-col justify-center px-6 lg:px-16 py-20 lg:py-32">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-5 font-normal tracking-tight">
            Find Us Offline
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            Our showroom are available for visit by appointment only.
            <br />
            Contact our store admin through whatsapp.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-foreground">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm md:text-base">081293861426</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm md:text-base">DKI Jakarta, Indonesia</span>
            </div>
          </div>

          <a
            href={buildWhatsAppUrl(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 rounded-full font-medium hover:bg-foreground/85 transition-all duration-300 self-start"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Image — right, full width/height, no border radius */}
        <div className="relative min-h-[420px] lg:min-h-0 bg-cream">
          <Image
            src={image}
            alt="Custom at Suka showroom"
            fill
            unoptimized={image.startsWith("http")}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
