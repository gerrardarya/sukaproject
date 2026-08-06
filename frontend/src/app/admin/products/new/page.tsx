"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createProduct } from "../../actions";
import CategorySelect from "../../components/CategorySelect";
import ProductPreviewCard from "../../components/ProductPreviewCard";
import ProductImagesField, { ProductImageItem } from "../../components/ProductImagesField";
import { ArrowLeft, Save } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<ProductImageItem[]>([]);

  const [noPrice, setNoPrice] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    is_active: true,
  });

  const handleToggleNoPrice = () => {
    setNoPrice((prev) => {
      const next = !prev;
      if (next) setForm((f) => ({ ...f, price: "" }));
      return next;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

    let uploadedUrls: string[];
    setUploading(true);
    try {
      uploadedUrls = await Promise.all(images.map((img) => uploadImage(img.file!)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
      setSaving(false);
      setUploading(false);
      return;
    }
    setUploading(false);

    try {
      await createProduct({
        name: form.name,
        description: form.description,
        price: noPrice ? 0 : parseFloat(form.price),
        image_url: uploadedUrls[0] ?? "",
        image_urls: uploadedUrls,
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
      <div className="max-w-5xl mx-auto">
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

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Product Images</h2>
              <ProductImagesField images={images} onChange={setImages} />
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
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground" htmlFor="price">
                      Price (IDR) {!noPrice && <span className="text-red-400">*</span>}
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span className="text-[11px] text-muted">No price</span>
                      <span className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={noPrice}
                          onChange={handleToggleNoPrice}
                          className="sr-only peer"
                        />
                        <span className="w-8 h-5 bg-border/60 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></span>
                      </span>
                    </label>
                  </div>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder={noPrice ? "No price set" : "250000"}
                    required={!noPrice}
                    disabled={noPrice}
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="category">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <CategorySelect
                    value={form.category}
                    onChange={(category) => setForm((prev) => ({ ...prev, category }))}
                  />
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

          {/* ── Right: Live Preview ── */}
          <div className="w-full lg:w-72 lg:sticky lg:top-8 shrink-0 space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted">
              Catalogue Preview
            </p>

            <ProductPreviewCard
              name={form.name}
              description={form.description}
              category={form.category}
              price={form.price}
              imagePreview={images[0]?.url ?? ""}
              isLocalFile={Boolean(images[0]?.file)}
            />

            {uploading && (
              <div className="flex items-center gap-2 text-xs text-accent">
                <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Uploading to storage...
              </div>
            )}

            {/* Status indicator */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-border/40 text-xs">
              <span
                className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-200 ${
                  form.is_active ? "bg-green-400" : "bg-border"
                }`}
              />
              <span className="text-muted">
                {form.is_active ? "Visible on storefront" : "Hidden from storefront"}
              </span>
            </div>

            <p className="text-[10px] text-muted/50 text-center leading-relaxed px-1">
              Preview updates as you fill in the form. Images are uploaded when you save.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
