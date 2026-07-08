"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { updateBanner } from "../../../actions";
import AdminSidebar from "../../../components/AdminSidebar";
import { ArrowLeft, Save, ImageIcon, Upload, X, ExternalLink } from "lucide-react";

type Banner = {
  id: number;
  title: string;
  description: string | null;
  button_text: string | null;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

function BannerPreview({
  title,
  description,
  buttonText,
  imagePreview,
  isLocalFile,
  isActive,
  sortOrder,
}: {
  title: string;
  description: string;
  buttonText: string;
  imagePreview: string;
  isLocalFile: boolean;
  isActive: boolean;
  sortOrder: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted">
          Hero Preview
        </p>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-accent hover:text-accent/70 transition-colors duration-200"
        >
          View live
          <ExternalLink className="w-2.5 h-2.5" />
        </Link>
      </div>

      {/* Banner mock */}
      <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden bg-foreground/10 border border-border/30">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Banner preview"
            fill
            className="object-cover transition-opacity duration-300"
            unoptimized={isLocalFile || imagePreview.startsWith("blob:")}
            sizes="672px"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 bg-[#f0efea]">
            <ImageIcon className="w-8 h-8 text-border/60" />
            <p className="text-xs text-muted/40">No image yet</p>
          </div>
        )}

        {/* Gradient overlay — mirrors HeroSection exactly */}
        {imagePreview && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        )}

        {/* Text overlay — bottom-left like HeroSection */}
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-5 z-10 pointer-events-none">
          {title.trim() ? (
            <h2 className="text-white text-lg font-semibold tracking-tight leading-tight mb-1.5 max-w-xs">
              {title}
            </h2>
          ) : (
            <h2 className="text-white/30 text-base font-medium tracking-tight mb-1.5 italic">
              Banner title…
            </h2>
          )}

          {description.trim() ? (
            <p className="text-white/85 text-xs leading-relaxed max-w-xs mb-3">
              {description.trim()}
            </p>
          ) : null}

          {/* CTA — same style as HeroSection */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white text-black text-[11px] font-medium w-fit opacity-70">
            {buttonText.trim() || "Button text…"}
          </div>
        </div>

        {/* Status badges — top-left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
          <span className="px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium backdrop-blur-sm">
            Slide #{sortOrder}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm ${
              isActive
                ? "bg-green-500/80 text-white"
                : "bg-black/50 text-white/50"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Dot indicator row — bottom-right, like HeroSection */}
        <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === 0 ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Progress bar — bottom, like HeroSection */}
        <div className="absolute bottom-0 left-0 h-[2px] w-2/5 bg-white/60 z-20" />
      </div>

      <p className="text-[10px] text-muted/50 leading-relaxed">
        Preview updates as you edit. Gradient, CTA, and indicators match the live homepage hero.
      </p>
    </div>
  );
}

export default function EditBannerPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [takenOrders, setTakenOrders] = useState<number[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    button_text: "Create Yours Now!",
    image_url: "",
    is_active: true,
    sort_order: 1,
  });

  useEffect(() => {
    const fetchBanner = async () => {
      const [{ data: banner, error }, { data: allBanners }] = await Promise.all([
        supabase.from("banners").select("*").eq("id", id).single(),
        supabase.from("banners").select("sort_order, id"),
      ]);

      if (!error && banner) {
        const b = banner as Banner;
        setForm({
          title: b.title || "",
          description: b.description ?? "",
          button_text: b.button_text ?? "Create Yours Now!",
          image_url: b.image_url,
          is_active: b.is_active,
          sort_order: b.sort_order,
        });
        setImagePreview(b.image_url);
      }

      if (allBanners) {
        setTakenOrders(
          allBanners
            .filter((b) => String(b.id) !== String(id))
            .map((b) => b.sort_order)
        );
      }

      setLoading(false);
    };

    if (id) fetchBanner();
  }, [id]);

  const isOrderTaken = takenOrders.includes(Number(form.sort_order));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    let image_url = form.image_url;

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

    try {
      await updateBanner(id, {
        title: form.title,
        description: form.description.trim(),
        button_text: form.button_text.trim() || "Create Yours Now!",
        image_url,
        is_active: form.is_active,
        sort_order: Number(form.sort_order),
      });
      router.replace("/admin/banners");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update banner");
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/banners"
              className="p-2 rounded-xl bg-white border border-border/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Edit Banner</h1>
              <p className="text-sm text-muted mt-0.5">Update your banner image and settings</p>
            </div>
          </div>

          {/* Live Preview — above the form */}
          <div className="mb-6">
            <BannerPreview
              title={form.title}
              description={form.description}
              buttonText={form.button_text}
              imagePreview={imagePreview}
              isLocalFile={imageFile !== null}
              isActive={form.is_active}
              sortOrder={Number(form.sort_order)}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm">
              <label className="block text-sm font-medium text-foreground mb-3">Banner Image</label>

              {imagePreview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border/40 bg-[#f8f7f4]">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized={imageFile !== null || imagePreview.startsWith("blob:")}
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
                  {imageFile && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/90 text-xs text-muted font-medium shadow-sm">
                      {imageFile.name}
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
                    Click to upload banner image
                  </p>
                  <p className="text-xs text-muted/60 mt-1">PNG, JPG, WEBP — recommended 1920×600px</p>
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
                  Uploading to storage...
                </div>
              )}

              {!imagePreview && (
                <div className="flex items-center gap-2 mt-3">
                  <ImageIcon className="w-3.5 h-3.5 text-muted/40 flex-shrink-0" />
                  <p className="text-xs text-muted/60">Image will be saved to your Supabase &lsquo;images&rsquo; bucket</p>
                </div>
              )}
            </div>

            {/* Banner Info */}
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Banner Info</h2>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Ramadan Special Collection"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
                <p className="text-xs text-muted">Shown on the hero slide (headline)</p>
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
                  rows={3}
                  placeholder="Short line under the title on the homepage hero…"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-y min-h-[88px]"
                />
                <p className="text-xs text-muted">Optional — appears below the title on the storefront hero</p>
              </div>

              {/* Button Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="button_text">
                  Button Text
                </label>
                <input
                  id="button_text"
                  name="button_text"
                  type="text"
                  value={form.button_text}
                  onChange={handleChange}
                  placeholder="Create Yours Now!"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
                <p className="text-xs text-muted">CTA button label shown on the hero slide</p>
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
                  className={`w-full px-4 py-3 rounded-xl border text-foreground text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isOrderTaken
                      ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400"
                      : "border-border/60 bg-[#f8f7f4] focus:ring-accent/30 focus:border-accent"
                  }`}
                />
                {isOrderTaken ? (
                  <p className="text-xs text-red-500 font-medium">
                    ⚠ Order #{form.sort_order} is already taken. Choose a different number.
                  </p>
                ) : (
                  <p className="text-xs text-muted">
                    Lower number = shown first
                    {takenOrders.length > 0 && (
                      <span className="ml-1 text-muted/60">
                        — taken: {takenOrders.sort((a, b) => a - b).join(", ")}
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#f8f7f4] border border-border/40">
                <div>
                  <p className="text-sm font-medium text-foreground">Active Status</p>
                  <p className="text-xs text-muted mt-0.5">Show this banner on the storefront</p>
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

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/admin/banners"
                className="flex-1 text-center px-6 py-3.5 rounded-xl border border-border/50 text-sm font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-all duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || isOrderTaken}
                className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Banner
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
