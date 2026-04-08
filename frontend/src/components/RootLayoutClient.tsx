"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import WelcomePopup from "./WelcomePopup";
import FloatingWhatsApp from "./FloatingWhatsApp";
import { supabase } from "@/lib/supabase";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "welcome_popup_seen";

type PopupRow = {
  name: string | null;
  description: string | null;
  image_url: string | null;
};

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [popup, setPopup] = useState<PopupRow | null>(null);

  useEffect(() => {
    setShowPopup(false);
    setPopup(null);

    if (pathname !== "/") return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("popups")
        .select("name, description, image_url")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (cancelled || error || !data) return;

      const row = data as PopupRow;
      const image_url = row.image_url?.trim();
      if (!image_url) return;

      setPopup({
        name: row.name,
        description: row.description,
        image_url,
      });
      setShowPopup(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const handleClose = () => {
    setShowPopup(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <>
      {showPopup && popup?.image_url && (
        <WelcomePopup
          onClose={handleClose}
          name={popup.name ?? ""}
          description={popup.description ?? ""}
          imageUrl={popup.image_url}
        />
      )}
      {children}
      <FloatingWhatsApp />
    </>
  );
}
