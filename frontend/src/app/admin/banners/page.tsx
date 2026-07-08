"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { deleteBanner, toggleBannerActive, reorderBanners } from "../actions";
import AdminSidebar from "../components/AdminSidebar";
import { Plus, ToggleLeft, ToggleRight, Trash2, Pencil, ImageIcon, GripVertical } from "lucide-react";

type Banner = {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const dragIndexRef = useRef<number | null>(null);
  const orderChangedRef = useRef(false);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (!error && data) setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleToggleActive = async (banner: Banner) => {
    await toggleBannerActive(banner.id, !banner.is_active);
    fetchBanners();
  };

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
    orderChangedRef.current = false;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;

    setBanners((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndexRef.current = index;
    orderChangedRef.current = true;
  };

  const handleDragEnd = async () => {
    dragIndexRef.current = null;
    if (!orderChangedRef.current) return;
    orderChangedRef.current = false;

    setSavingOrder(true);
    try {
      await reorderBanners(banners.map((b) => b.id));
      // Reflect the persisted order locally without a full refetch
      setBanners((prev) =>
        prev.map((b, i) => ({ ...b, sort_order: i + 1 }))
      );
    } catch {
      // Persisting failed — reload the real order from the database
      await fetchBanners();
    }
    setSavingOrder(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    setDeletingId(id);
    await deleteBanner(id);
    setDeletingId(null);
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Banners</h1>
            <p className="text-sm text-muted mt-1">
              {banners.length} total banners · drag rows to reorder
              {savingOrder && (
                <span className="ml-2 text-accent">Saving order…</span>
              )}
            </p>
          </div>
          <Link
            href="/admin/banners/new"
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </Link>
        </div>

        {/* Banners List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ImageIcon className="w-12 h-12 text-muted/30 mb-4" />
            <p className="text-muted font-medium">No banners yet</p>
            <p className="text-sm text-muted/70 mt-1">Add your first banner to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f7f4] border-b border-border/40">
                <tr>
                  <th className="w-10 px-3 py-3.5" aria-label="Drag to reorder" />
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Banner</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Title</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide max-w-[220px]">Description</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Order</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {banners.map((banner, index) => (
                  <tr
                    key={banner.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => e.preventDefault()}
                    onDragEnd={handleDragEnd}
                    className="hover:bg-[#f8f7f4]/50 transition-colors"
                  >
                    <td className="px-3 py-4 cursor-grab active:cursor-grabbing text-muted/40 hover:text-muted">
                      <GripVertical className="w-4 h-4" />
                    </td>
                    <td className="px-5 py-4">
                      {banner.image_url ? (
                        <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-border/30 flex-shrink-0">
                          <Image
                            src={banner.image_url}
                            alt={banner.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-12 rounded-lg bg-border/20 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-5 h-5 text-muted/40" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{banner.title || <span className="text-muted/50 italic">No title</span>}</p>
                    </td>
                    <td className="px-5 py-4 max-w-[220px]">
                      <p className="text-muted text-xs line-clamp-2" title={banner.description || undefined}>
                        {banner.description?.trim()
                          ? banner.description
                          : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-border/20 text-muted">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(banner)}
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      >
                        {banner.is_active ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-green-500" />
                            <span className="text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-muted" />
                            <span className="text-muted">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/banners/${banner.id}/edit`}
                          className="p-2 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          disabled={deletingId === banner.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-all duration-200 disabled:opacity-40"
                        >
                          {deletingId === banner.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
