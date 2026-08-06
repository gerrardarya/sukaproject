"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { upsertWhatsAppSettings } from "../actions";
import AdminSidebar from "../components/AdminSidebar";
import { ArrowLeft, MessageCircle, Save } from "lucide-react";

type WhatsAppSettingsRow = {
  id?: number;
  greeting_message: string | null;
  prefilled_message: string | null;
  phone_number: string | null;
};

export default function AdminWhatsAppPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    greeting_message: "",
    prefilled_message: "",
    phone_number: "",
  });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("whatsapp_settings")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!fetchError && data) {
      const row = data as WhatsAppSettingsRow;
      setForm({
        greeting_message: row.greeting_message ?? "",
        prefilled_message: row.prefilled_message ?? "",
        phone_number: row.phone_number ?? "",
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const digitsOnly = form.phone_number.replace(/\D/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.greeting_message.trim() || !form.prefilled_message.trim()) {
      setError("Both messages are required.");
      return;
    }
    if (digitsOnly.length < 8) {
      setError("Enter a valid WhatsApp number, including the country code (e.g. 6281234567890).");
      return;
    }

    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      await upsertWhatsAppSettings({
        greeting_message: form.greeting_message.trim(),
        prefilled_message: form.prefilled_message.trim(),
        phone_number: digitsOnly,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save WhatsApp settings");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />

      <main className="ml-64 py-10 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-white border border-border/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">WhatsApp Settings</h1>
              <p className="text-sm text-muted mt-0.5">
                Contact number and floating chat bubble (site-wide)
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Contact Number
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="phone_number">
                  WhatsApp Number <span className="text-red-400">*</span>
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  inputMode="numeric"
                  value={form.phone_number}
                  onChange={handleChange}
                  required
                  placeholder="6281234567890"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
                <p className="text-xs text-muted">
                  Country code + number, no spaces, dashes or leading &ldquo;+&rdquo; (e.g. 6281234567890 for an Indonesian number). Used for every WhatsApp link and button on the site.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Messages
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="greeting_message">
                  Greeting Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="greeting_message"
                  name="greeting_message"
                  value={form.greeting_message}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Hi there! 👋 How can we help you today?"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-y min-h-[80px]"
                />
                <p className="text-xs text-muted">Shown inside the popup card before visitors click anything</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="prefilled_message">
                  Pre-filled Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="prefilled_message"
                  name="prefilled_message"
                  value={form.prefilled_message}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Hi! I'd like to know more about your products."
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-y min-h-[80px]"
                />
                <p className="text-xs text-muted">Auto-typed into WhatsApp when a visitor taps &ldquo;Start Chat&rdquo;</p>
              </div>
            </div>

            {/* Live preview */}
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Preview
              </h2>
              <div className="bg-[#f8f7f4] rounded-2xl border border-border/30 p-4 w-64">
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
                <div className="bg-[#f0fdf4] rounded-xl rounded-tl-sm px-3.5 py-2.5 mb-4">
                  <p className="text-foreground text-xs leading-relaxed whitespace-pre-line">
                    {form.greeting_message || "Your greeting message will appear here…"}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white text-sm font-medium py-2.5 rounded-xl">
                  <MessageCircle className="w-4 h-4" />
                  Start Chat
                </div>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm">
                WhatsApp settings saved.
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href="/admin"
                className="flex-1 text-center px-6 py-3.5 rounded-xl border border-border/50 text-sm font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-all duration-200"
              >
                Back
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
