"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PreLoaderProps {
  onLoadingComplete?: () => void;
}

export default function PreLoader({ onLoadingComplete }: PreLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can adjust this or use real loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete?.();
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-accent/10 rounded-full blur-lg" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2,
              }}
              className="relative"
            >
              <motion.div
                animate={{
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <Image
                  src="/logo/logo-red.png"
                  alt="Premium Gifting"
                  width={120}
                  height={120}
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Glow Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                className="absolute inset-0 bg-accent/20 rounded-full blur-xl"
              />
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.8,
              }}
              className="text-center space-y-2"
            >
              <motion.h2
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
                className="font-serif text-2xl text-foreground font-medium tracking-tight"
              >
                Premium Gifting
              </motion.h2>
              <motion.p
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.4,
                }}
                className="text-muted text-sm"
              >
                Creating art through thoughtful giving
              </motion.p>
            </motion.div>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.4 }}
              className="flex space-x-2"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-2 h-2 bg-accent rounded-full"
                />
              ))}
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="w-32 h-1 bg-border rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.5,
                }}
                className="h-full bg-accent rounded-full"
              />
            </motion.div>
          </div>

          {/* Exit Animation Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{
              duration: 2.5,
              times: [0, 0.8, 1],
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
