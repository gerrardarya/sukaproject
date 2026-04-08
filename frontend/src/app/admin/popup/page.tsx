"use client";

/**
 * Uses table `public.popups` with columns: image_url, name, description.
 * Add a primary key `id` (uuid or serial) so updates target the same row.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { upsertPopup } from "../actions";
import AdminSidebar from "../components/AdminSidebar";
import { ArrowLeft, ImageIcon, Save, Upload, X } from "lucide-react";

type PopupRow = {
  id?: string | number;
  name: string | null;
  description: string | null;
  image_url: string | null;
};

export default function AdminPopupPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  const loadPopup = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("popups")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!fetchError && data) {
      const row = data as PopupRow;
      setForm({
        name: row.name ?? "",
        description: row.description ?? "",
        image_url: row.image_url ?? "",
      });
      if (row.image_url) setImagePreview(row.image_url);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPopup();
  }, [loadPopup]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm((prev) => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `popup-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (upErr) throw new Error(upErr.message);

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    let image_url = form.image_url.trim();

    if (imageFile) {
      setUploading(true);
      try {
        image_url = await uploadImage(imageFile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Image upload failed");
        setSaving(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (!image_url) {
      setError("Please upload an image for the popup.");
      setSaving(false);
      return;
    }

    try {
      await upsertPopup({
        name: form.name,
        description: form.description,
        image_url,
      });
      setSuccess(true);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setForm((prev) => ({ ...prev, image_url }));
      setImagePreview(image_url);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save popup");
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
              <h1 className="text-2xl font-semibold text-foreground">Popup</h1>
              <p className="text-sm text-muted mt-0.5">
                One image, name, and description (single site-wide popup row)
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm">
              <label className="block text-sm font-medium text-foreground mb-3">
                Image <span className="text-red-400">*</span>
              </label>

              {imagePreview ? (
                <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden border border-border/40 bg-[#f8f7f4]">
                  <Image
                    src={imagePreview}
                    alt="Popup preview"
                    fill
                    className="object-contain"
                    unoptimized={
                      imagePreview.startsWith("blob:") ||
                      imagePreview.startsWith("http")
                    }
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-muted hover:text-red-500 shadow-sm transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-medium text-muted hover:text-accent shadow-sm transition-all duration-200"
                  >
                    <Upload className="w-3 h-3" />
                    Replace
                  </button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ")
                      fileInputRef.current?.click();
                  }}
                  className="flex flex-col items-center justify-center w-full h-52 rounded-xl border-2 border-dashed border-border/50 bg-[#f8f7f4] hover:border-accent/50 hover:bg-accent/5 cursor-pointer transition-all duration-200 group"
                >
                  <div className="p-3 rounded-full bg-border/20 group-hover:bg-accent/10 transition-all duration-200 mb-3">
                    <Upload className="w-6 h-6 text-muted group-hover:text-accent transition-colors duration-200" />
                  </div>
                  <p className="text-sm font-medium text-muted group-hover:text-accent transition-colors duration-200">
                    Click to upload image
                  </p>
                  <p className="text-xs text-muted/60 mt-1">PNG, JPG, WEBP</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploading && (
                <div className="flex items-center gap-2 mt-3 text-xs text-accent">
                  <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  Uploading…
                </div>
              )}

              {!imagePreview && (
                <div className="flex items-center gap-2 mt-3">
                  <ImageIcon className="w-3.5 h-3.5 text-muted/40 flex-shrink-0" />
                  <p className="text-xs text-muted/60">Stored in Supabase bucket &lsquo;images&rsquo;</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Content
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Popup title or headline"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Supporting text shown with the popup…"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-y min-h-[100px]"
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm">
                Popup saved.
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
                disabled={saving || !imagePreview}
                className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save popup
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
