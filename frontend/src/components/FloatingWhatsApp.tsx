"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const WHATSAPP_NUMBER = "1234567890";

const DEFAULT_GREETING_MESSAGE =
  "Hi there! 👋 How can we help you today? Let us know what you need and we'll craft something special just for you.";
const DEFAULT_PREFILLED_MESSAGE = "Hi! I'd like to know more about your products.";

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState(DEFAULT_GREETING_MESSAGE);
  const [prefilledMessage, setPrefilledMessage] = useState(DEFAULT_PREFILLED_MESSAGE);

  useEffect(() => {
    supabase
      .from("whatsapp_settings")
      .select("greeting_message, prefilled_message")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.greeting_message) setGreetingMessage(data.greeting_message);
        if (data?.prefilled_message) setPrefilledMessage(data.prefilled_message);
      });
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip / mini card */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl border border-border/30 p-4 w-64"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold leading-tight">Custom at Suka</p>
                <span className="flex items-center gap-1 text-xs text-[#25D366]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block" />
                  Online
                </span>
              </div>
            </div>

            {/* Bubble message */}
            <div className="bg-[#f0fdf4] rounded-xl rounded-tl-sm px-3.5 py-2.5 mb-4">
              <p className="text-foreground text-xs leading-relaxed whitespace-pre-line">
                {greetingMessage}
              </p>
            </div>

            {/* CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-medium py-2.5 rounded-xl transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              Start Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow duration-300"
      >
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
