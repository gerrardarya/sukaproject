"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase, Product } from "@/lib/supabase";
import { updateProduct } from "../../../actions";
import { ArrowLeft, Save, Upload, X, ExternalLink } from "lucide-react";

const CATEGORIES = [
  "Signature Hamper Collection",
  "Artisan Gift Curation",
  "Premium Baby Essential",
  "Corporate Gift",
  "Custom Order",
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function PreviewCard({
  name,
  description,
  category,
  price,
  imagePreview,
  isLocalFile,
  fileName,
  onReplace,
  onRemove,
}: {
  name: string;
  description: string;
  category: string;
  price: string;
  imagePreview: string;
  isLocalFile: boolean;
  fileName?: string;
  onReplace: () => void;
  onRemove: () => void;
}) {
  const numericPrice = parseFloat(price);
  const hasPrice = !isNaN(numericPrice) && numericPrice > 0;

  return (
    <div className="border border-border/60 bg-white overflow-hidden shadow-sm">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#f0efea] overflow-hidden">
        {imagePreview ? (
          <>
            <Image
              src={imagePreview}
              alt={name || "Preview"}
              fill
              className="object-cover transition-opacity duration-300"
              unoptimized={isLocalFile || imagePreview.startsWith("blob:")}
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent opacity-80" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-muted hover:text-red-500 shadow-sm transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onReplace}
              className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-medium text-muted hover:text-accent shadow-sm transition-all duration-200"
            >
              <Upload className="w-3 h-3" />
              Replace
            </button>
            {fileName && (
              <div className="absolute bottom-2 left-2 max-w-[55%] truncate px-2.5 py-1 rounded-full bg-white/90 text-xs text-muted font-medium shadow-sm">
                {fileName}
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={onReplace}
            className="flex flex-col items-center justify-center w-full h-full gap-2 cursor-pointer hover:bg-accent/5 transition-colors duration-200 group"
          >
            <Upload className="w-8 h-8 text-border/60 group-hover:text-accent transition-colors duration-200" />
            <p className="text-xs text-muted/60 group-hover:text-accent transition-colors duration-200 font-medium">
              Click to upload image
            </p>
            <p className="text-[10px] text-muted/40">PNG, JPG, WEBP up to 10MB</p>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        {category && (
          <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-accent line-clamp-1">
            {category}
          </p>
        )}
        <h3 className="text-foreground text-sm font-semibold leading-snug tracking-tight line-clamp-2 min-h-[2.5rem]">
          {name || <span className="text-muted/40 font-normal">Product name…</span>}
        </h3>
        <p className="text-muted text-xs leading-relaxed whitespace-pre-line line-clamp-2 min-h-[2rem]">
          {description || <span className="text-muted/30">Description will appear here…</span>}
        </p>
        {hasPrice && (
          <p className="text-foreground/80 text-sm font-medium pt-0.5">
            {formatPrice(numericPrice)}
          </p>
        )}
      </div>
    </div>
  );
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const product = data as Product;
        setForm({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          image_url: product.image_url,
          category: product.category,
          is_active: product.is_active,
        });
        setImagePreview(product.image_url);
      }
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

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
      await updateProduct(id, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        image_url,
        category: form.category,
        is_active: form.is_active,
      });
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
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
            <h1 className="text-2xl font-semibold text-foreground">Edit Product</h1>
            <p className="text-sm text-muted mt-0.5">Update your product information</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-6">
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
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ── Right: Live Preview ── */}
          <div className="w-full lg:w-72 lg:sticky lg:top-8 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted">
                Catalogue Preview
              </p>
              {id && (
                <Link
                  href={`/products/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-accent hover:text-accent/70 transition-colors duration-200"
                >
                  View live
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              )}
            </div>

            <PreviewCard
              name={form.name}
              description={form.description}
              category={form.category}
              price={form.price}
              imagePreview={imagePreview}
              isLocalFile={imageFile !== null}
              fileName={imageFile?.name}
              onReplace={() => fileInputRef.current?.click()}
              onRemove={handleRemoveImage}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              className="hidden"
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
              Preview updates as you edit. Saved changes appear on the live site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
