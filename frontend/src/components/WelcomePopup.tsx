"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

interface WelcomePopupProps {
  onClose: () => void;
  name: string;
  description: string;
  imageUrl: string;
}

export default function WelcomePopup({
  onClose,
  name,
  description,
  imageUrl,
}: WelcomePopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleBrowseMore = () => {
    setVisible(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-3 sm:px-6 py-8"
          >
            <div className="relative w-full max-w-4xl max-h-[min(85vh,640px)] min-h-[min(75vh,520px)] shadow-2xl border border-border/20 bg-white p-3 sm:p-4">
              <div className="absolute inset-3 sm:inset-4 overflow-hidden">
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/35 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-200"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute inset-0">
                  <Image
                    src={imageUrl}
                    alt={name.trim() || "Popup"}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 896px) 100vw, 896px"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent sm:from-black/65 sm:via-black/30"
                    aria-hidden
                  />
                </div>

                <div className="relative z-10 h-full flex items-center justify-start px-8 sm:px-12 md:px-14 lg:px-16 py-10">
                  <div className="max-w-[min(100%,22rem)] sm:max-w-md space-y-5 text-left">
                    {name.trim() ? (
                      <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight drop-shadow-md [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
                        {name.trim()}
                      </h2>
                    ) : null}
                    {description.trim() ? (
                      <p className="text-sm sm:text-base text-white/95 leading-relaxed drop-shadow-md [text-shadow:0_1px_16px_rgba(0,0,0,0.4)]">
                        {description.trim()}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={handleBrowseMore}
                      className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 text-sm font-semibold text-foreground shadow-lg hover:bg-white/95 hover:shadow-xl transition-all duration-300"
                    >
                      Browse more
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
