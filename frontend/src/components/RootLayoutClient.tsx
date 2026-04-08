"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import WelcomePopup from "./WelcomePopup";
import FloatingWhatsApp from "./FloatingWhatsApp";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "welcome_popup_seen";

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Only show on homepage and only once per session
    if (pathname !== "/") return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShowPopup(true);
    }
  }, [pathname]);

  const handleClose = () => {
    setShowPopup(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <>
      {showPopup && <WelcomePopup onClose={handleClose} />}
      {children}
      <FloatingWhatsApp />
    </>
  );
}
