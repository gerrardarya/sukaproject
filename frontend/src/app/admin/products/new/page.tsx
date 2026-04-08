"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { createProduct } from "../../actions";
import { ArrowLeft, Save, ImageIcon, Upload, X } from "lucide-react";

const CATEGORIES = [
  "Signature Hamper Collection",
  "Artisan Gift Curation",
  "Premium Baby Essential",
  "Corporate Gift",
  "Custom Order",
];

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: CATEGORIES[0],
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, image_url: "" }));
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
      await createProduct({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        image_url,
        category: form.category,
        is_active: form.is_active,
      });
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] py-10 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-white border border-border/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Add New Product</h1>
            <p className="text-sm text-muted mt-0.5">Fill in the details to create a new product</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm">
            <label className="block text-sm font-medium text-foreground mb-3">Product Image</label>

            {imagePreview ? (
              /* Preview with remove button */
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-border/40 bg-[#f8f7f4]">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized={imageFile !== null} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-muted hover:text-red-500 shadow-sm transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
                {imageFile && (
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/90 text-xs text-muted font-medium shadow-sm">
                    {imageFile.name}
                  </div>
                )}
              </div>
            ) : (
              /* Upload dropzone */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-border/50 bg-[#f8f7f4] hover:border-accent/50 hover:bg-accent/5 cursor-pointer transition-all duration-200 group"
              >
                <div className="p-3 rounded-full bg-border/20 group-hover:bg-accent/10 transition-all duration-200 mb-3">
                  <Upload className="w-6 h-6 text-muted group-hover:text-accent transition-colors duration-200" />
                </div>
                <p className="text-sm font-medium text-muted group-hover:text-accent transition-colors duration-200">
                  Click to upload image
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
                Uploading to storage...
              </div>
            )}

            {/* No image placeholder info */}
            {!imagePreview && (
              <div className="flex items-center gap-2 mt-3">
                <ImageIcon className="w-3.5 h-3.5 text-muted/40 flex-shrink-0" />
                <p className="text-xs text-muted/60">Image will be saved to your Supabase &lsquo;images&rsquo; bucket</p>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Product Info</h2>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="name">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Artisan Welcome Hamper"
                required
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="description">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what makes this product special..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-none"
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="price">
                  Price (IDR) <span className="text-red-400">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="250000"
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="category">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#f8f7f4] border border-border/40">
              <div>
                <p className="text-sm font-medium text-foreground">Active Status</p>
                <p className="text-xs text-muted mt-0.5">Show this product on the storefront</p>
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
              href="/admin"
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
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
