"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase, type Testimonial } from "@/lib/supabase";
import { deleteTestimonial, toggleTestimonialActive } from "../actions";
import AdminSidebar from "../components/AdminSidebar";
import { Plus, ToggleLeft, ToggleRight, Trash2, Pencil, MessageSquareQuote, ImageIcon } from "lucide-react";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) setTestimonials(data as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleToggleActive = async (testimonial: Testimonial) => {
    await toggleTestimonialActive(testimonial.id, !testimonial.is_active);
    fetchTestimonials();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteTestimonial(id);
    setDeletingId(null);
    fetchTestimonials();
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Testimonials</h1>
            <p className="text-sm text-muted mt-1">
              {testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""} — shown on the Testimonials page
            </p>
          </div>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MessageSquareQuote className="w-12 h-12 text-muted/30 mb-4" />
            <p className="text-muted font-medium">No testimonials yet</p>
            <p className="text-sm text-muted/70 mt-1">Add your first testimonial to populate the Testimonials page</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f7f4] border-b border-border/40">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Result Image</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Client</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Quote</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Result</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Order</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-[#f8f7f4]/50 transition-colors">
                    <td className="px-5 py-4">
                      {testimonial.result_image_url ? (
                        <div className="relative w-16 h-11 rounded-lg overflow-hidden border border-border/30 bg-white flex-shrink-0">
                          <Image
                            src={testimonial.result_image_url}
                            alt={testimonial.client_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-11 rounded-lg bg-border/20 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-4 h-4 text-muted/40" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{testimonial.client_name}</p>
                      {testimonial.company && (
                        <p className="text-xs text-muted mt-0.5">{testimonial.company}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-muted line-clamp-2">{testimonial.quote}</p>
                    </td>
                    <td className="px-5 py-4 max-w-[10rem]">
                      {testimonial.result_text ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent line-clamp-1">
                          {testimonial.result_text}
                        </span>
                      ) : (
                        <span className="text-muted/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-border/20 text-muted">
                        #{testimonial.sort_order}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(testimonial)}
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      >
                        {testimonial.is_active ? (
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
                          href={`/admin/testimonials/${testimonial.id}/edit`}
                          className="p-2 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={deletingId === testimonial.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-all duration-200 disabled:opacity-40"
                        >
                          {deletingId === testimonial.id ? (
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
