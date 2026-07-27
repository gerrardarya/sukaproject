"use client";

import { useEffect, useState } from "react";
import { supabase, type Category } from "@/lib/supabase";
import { createCategory, deleteCategory } from "../actions";
import AdminSidebar from "../components/AdminSidebar";
import { Plus, Trash2, Tags } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (!fetchError && data) setCategories(data as Category[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    setAdding(true);
    setError("");
    try {
      await createCategory(trimmed);
      setNewName("");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category", category.name);

    const usageNote =
      count && count > 0
        ? ` ${count} product${count !== 1 ? "s" : ""} currently use this category — they will keep it, but it won't be selectable as a preset anymore.`
        : "";

    if (!confirm(`Delete "${category.name}"? This cannot be undone.${usageNote}`)) return;

    setDeletingId(category.id);
    try {
      await deleteCategory(category.id);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
            <p className="text-sm text-muted mt-1">
              {categories.length} categor{categories.length !== 1 ? "ies" : "y"} — available when creating or editing products
            </p>
          </div>
        </div>

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="flex items-center gap-3 mb-8 bg-white rounded-2xl border border-border/40 p-4 shadow-sm"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Ramadan Hamper"
            className="flex-1 px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
          />
          <button
            type="submit"
            disabled={adding || !newName.trim()}
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            <Plus className="w-4 h-4" />
            {adding ? "Adding…" : "Add Category"}
          </button>
        </form>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Tags className="w-12 h-12 text-muted/30 mb-4" />
            <p className="text-muted font-medium">No categories yet</p>
            <p className="text-sm text-muted/70 mt-1">Add your first category above</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f7f4] border-b border-border/40">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Name</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#f8f7f4]/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{category.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-all duration-200 disabled:opacity-40"
                        >
                          {deletingId === category.id ? (
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
