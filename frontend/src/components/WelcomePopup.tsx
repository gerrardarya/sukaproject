"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WelcomePopupProps {
  onClose: () => void;
}

export default function WelcomePopup({ onClose }: WelcomePopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay before showing so page has rendered
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[100]"
          />

          {/* Popup */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-4"
          >
            <div className="relative w-full max-w-sm bg-background rounded-3xl shadow-2xl overflow-hidden border border-border/30">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-muted hover:text-foreground transition-all duration-200 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top image band */}
              <div className="relative h-44 w-full bg-[#f8f7f4]">
                <Image
                  src="/logo/logo-red.png"
                  alt="Custom at Suka"
                  fill
                  className="object-contain p-8"
                  priority
                />
                {/* Decorative dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                </div>
              </div>

              {/* Content */}
              <div className="px-7 py-6 space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-semibold text-foreground tracking-tight">
                    Welcome to Custom at Suka ✨
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">
                    Thoughtfully crafted gifts & hampers, made with love and intention — just for you.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {/* WhatsApp CTA */}
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-accent text-white py-3 rounded-2xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat with Us on WhatsApp
                  </a>

                  {/* Explore CTA */}
                  <Link
                    href="/products"
                    onClick={handleClose}
                    className="flex items-center justify-center gap-2 w-full border border-border/60 text-foreground py-3 rounded-2xl text-sm font-medium hover:border-accent/50 hover:text-accent transition-all duration-200"
                  >
                    Explore Our Creations
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Dismiss */}
                <button
                  onClick={handleClose}
                  className="w-full text-xs text-muted/60 hover:text-muted transition-colors duration-200 pt-1"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
