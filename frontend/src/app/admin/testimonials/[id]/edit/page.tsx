"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase, type Testimonial } from "@/lib/supabase";
import { updateTestimonial } from "../../../actions";
import AdminSidebar from "../../../components/AdminSidebar";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

export default function EditTestimonialPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resultImagePreview, setResultImagePreview] = useState("");
  const [resultImageFile, setResultImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    client_name: "",
    company: "",
    result_image_url: "",
    quote: "",
    result_text: "",
    is_active: true,
    sort_order: 1,
  });

  useEffect(() => {
    const fetchTestimonial = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const t = data as Testimonial;
        setForm({
          client_name: t.client_name,
          company: t.company ?? "",
          result_image_url: t.result_image_url ?? "",
          quote: t.quote,
          result_text: t.result_text ?? "",
          is_active: t.is_active,
          sort_order: t.sort_order,
        });
        if (t.result_image_url) setResultImagePreview(t.result_image_url);
      }

      setLoading(false);
    };

    if (id) fetchTestimonial();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResultImageFile(file);
    setResultImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveResultImage = () => {
    setResultImageFile(null);
    setResultImagePreview("");
    setForm((prev) => ({ ...prev, result_image_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadResultImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name.trim() || !form.quote.trim()) {
      setError("Client name and quote are required.");
      return;
    }
    setSaving(true);
    setError("");

    let result_image_url = form.result_image_url;

    if (resultImageFile) {
      setUploading(true);
      try {
        result_image_url = await uploadResultImage(resultImageFile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Image upload failed");
        setSaving(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    try {
      await updateTestimonial(id, {
        client_name: form.client_name.trim(),
        company: form.company.trim(),
        result_image_url,
        quote: form.quote.trim(),
        result_text: form.result_text.trim(),
        is_active: form.is_active,
        sort_order: Number(form.sort_order),
      });
      router.replace("/admin/testimonials");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update testimonial");
      setSaving(false);
    }
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
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/testimonials"
              className="p-2 rounded-xl bg-white border border-border/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Edit Testimonial</h1>
              <p className="text-sm text-muted mt-0.5">Update testimonial info and result image</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Result Image Upload */}
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm">
              <label className="block text-sm font-medium text-foreground mb-3">
                Result Image <span className="text-muted font-normal">(optional)</span>
              </label>

              {resultImagePreview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border/40 bg-[#f8f7f4]">
                  <Image
                    src={resultImagePreview}
                    alt="Result preview"
                    fill
                    className="object-cover"
                    unoptimized={resultImageFile !== null || resultImagePreview.startsWith("blob:")}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveResultImage}
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
                  {resultImageFile && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/90 text-xs text-muted font-medium shadow-sm">
                      {resultImageFile.name}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-border/50 bg-[#f8f7f4] hover:border-accent/50 hover:bg-accent/5 cursor-pointer transition-all duration-200 group"
                >
                  <div className="p-3 rounded-full bg-border/20 group-hover:bg-accent/10 transition-all duration-200 mb-3">
                    <Upload className="w-6 h-6 text-muted group-hover:text-accent transition-colors duration-200" />
                  </div>
                  <p className="text-sm font-medium text-muted group-hover:text-accent transition-colors duration-200">
                    Click to upload result image
                  </p>
                  <p className="text-xs text-muted/60 mt-1">PNG, JPG, WEBP up to 10MB</p>
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
                  Uploading image…
                </div>
              )}

              <p className="text-xs text-muted/60 mt-3">
                A photo of the delivered work or outcome — shown alongside the quote.
              </p>
            </div>

            {/* Testimonial Info */}
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Testimonial Info</h2>

              {/* Name & Company */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="client_name">
                    Client Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="client_name"
                    name="client_name"
                    type="text"
                    value={form.client_name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Amelia"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="company">
                    Company <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g. Tokopedia"
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Quote */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="quote">
                  Quote <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="quote"
                  name="quote"
                  value={form.quote}
                  onChange={handleChange}
                  placeholder="What did the client say about working with us?"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-none"
                />
              </div>

              {/* Result */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="result_text">
                  Result <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  id="result_text"
                  name="result_text"
                  type="text"
                  value={form.result_text}
                  onChange={handleChange}
                  placeholder="e.g. Delivered 500 hampers in 2 weeks"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
                <p className="text-xs text-muted">A short outcome or stat shown as a highlight badge</p>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="sort_order">
                  Sort Order <span className="text-red-400">*</span>
                </label>
                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
                <p className="text-xs text-muted">Lower number = appears first on the page</p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#f8f7f4] border border-border/40">
                <div>
                  <p className="text-sm font-medium text-foreground">Active</p>
                  <p className="text-xs text-muted mt-0.5">Show this testimonial on the site</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-border/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href="/admin/testimonials"
                className="flex-1 text-center px-6 py-3.5 rounded-xl border border-border/50 text-sm font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-all duration-200"
              >
                Cancel
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
                    Update Testimonial
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
