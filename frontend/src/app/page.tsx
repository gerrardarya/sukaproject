"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProductsSection from "@/components/sections/FeaturedProductsSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import ProcessSection from "@/components/sections/ProcessSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CoreValuesSection from "@/components/sections/CoreValuesSection";
import WhatsAppCTASection from "@/components/sections/WhatsAppCTASection";
import InstagramGallerySection from "@/components/sections/InstagramGallerySection";
import LocomotiveScroll from "locomotive-scroll";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const locomotiveScroll = new LocomotiveScroll();

      setTimeout(() => {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }, 2000);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroSection />
      <FeaturedProductsSection />
      <PhilosophySection />
      <ProcessSection />
      <WhatsAppCTASection />
      <InstagramGallerySection />

      <Footer />
    </div>
  );
}
