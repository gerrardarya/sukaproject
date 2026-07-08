"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { updateClient } from "../../../actions";
import AdminSidebar from "../../../components/AdminSidebar";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

type Client = {
  id: number;
  name: string;
  logo_url: string | null;
  is_active: boolean;
  sort_order: number;
};

export default function EditClientPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    is_active: true,
    sort_order: 1,
  });

  useEffect(() => {
    const fetchClient = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const c = data as Client;
        setForm({
          name: c.name,
          logo_url: c.logo_url ?? "",
          is_active: c.is_active,
          sort_order: c.sort_order,
        });
        if (c.logo_url) setLogoPreview(c.logo_url);
      }

      setLoading(false);
    };

    if (id) fetchClient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setForm((prev) => ({ ...prev, logo_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `clients/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Client name is required.");
      return;
    }
    setSaving(true);
    setError("");

    let logo_url = form.logo_url;

    if (logoFile) {
      setUploading(true);
      try {
        logo_url = await uploadLogo(logoFile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Logo upload failed");
        setSaving(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    try {
      await updateClient(id, {
        name: form.name.trim(),
        logo_url,
        is_active: form.is_active,
        sort_order: Number(form.sort_order),
      });
      router.replace("/admin/clients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client");
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
              href="/admin/clients"
              className="p-2 rounded-xl bg-white border border-border/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Edit Client</h1>
              <p className="text-sm text-muted mt-0.5">Update client info and logo</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm">
              <label className="block text-sm font-medium text-foreground mb-3">
                Logo <span className="text-muted font-normal">(optional)</span>
              </label>

              {logoPreview ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border/40 bg-[#f8f7f4] flex items-center justify-center">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-contain p-4"
                    unoptimized={logoFile !== null || logoPreview.startsWith("blob:")}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
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
                  {logoFile && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/90 text-xs text-muted font-medium shadow-sm">
                      {logoFile.name}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-border/50 bg-[#f8f7f4] hover:border-accent/50 hover:bg-accent/5 cursor-pointer transition-all duration-200 group"
                >
                  <div className="p-3 rounded-full bg-border/20 group-hover:bg-accent/10 transition-all duration-200 mb-2">
                    <Upload className="w-5 h-5 text-muted group-hover:text-accent transition-colors duration-200" />
                  </div>
                  <p className="text-sm font-medium text-muted group-hover:text-accent transition-colors duration-200">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-muted/60 mt-1">PNG, JPG, SVG — transparent PNG recommended</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploading && (
                <div className="flex items-center gap-2 mt-3 text-xs text-accent">
                  <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  Uploading logo…
                </div>
              )}

              <p className="text-xs text-muted/60 mt-3">
                No logo? The client&apos;s name will be shown as text in the ticker.
              </p>
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Client Info</h2>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="name">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Tokopedia"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
                <p className="text-xs text-muted">Displayed in the ticker when no logo is uploaded</p>
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
                <p className="text-xs text-muted">Lower number = appears first in the ticker</p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#f8f7f4] border border-border/40">
                <div>
                  <p className="text-sm font-medium text-foreground">Active</p>
                  <p className="text-xs text-muted mt-0.5">Show this client in the ticker</p>
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
                href="/admin/clients"
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
                    Update Client
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
