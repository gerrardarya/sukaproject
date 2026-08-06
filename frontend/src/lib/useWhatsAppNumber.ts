"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export const DEFAULT_WHATSAPP_NUMBER = "1234567890";

export function useWhatsAppNumber() {
  const [number, setNumber] = useState(DEFAULT_WHATSAPP_NUMBER);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("whatsapp_settings")
      .select("phone_number")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const value = data?.phone_number?.trim();
        if (value) setNumber(value);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return number;
}

export function buildWhatsAppUrl(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
