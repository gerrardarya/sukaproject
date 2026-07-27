"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase, type Category } from "@/lib/supabase";
import { createCategory } from "../actions";

const ADD_NEW_VALUE = "__add_new__";

export default function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (!fetchError && data) {
        const list = data as Category[];
        setCategories(list);
        if (!value && list.length > 0) onChange(list[0].name);
      }
      setLoading(false);
    })();
    // Only load once on mount — the initial `value` at that time is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === ADD_NEW_VALUE) {
      setAdding(true);
      setNewName("");
      setError("");
      return;
    }
    onChange(e.target.value);
  };

  const handleAddCategory = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setSaving(true);
    setError("");
    try {
      const category = await createCategory(trimmed);
      setCategories((prev) =>
        [...prev, category].sort((a, b) => a.name.localeCompare(b.name))
      );
      onChange(category.name);
      setAdding(false);
      setNewName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  if (adding) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCategory();
              }
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="New category name"
            className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            disabled={saving || !newName.trim()}
            className="shrink-0 px-4 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Adding…" : "Add"}
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="shrink-0 px-3 rounded-xl border border-border/60 text-muted hover:text-foreground transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <select
      id="category"
      name="category"
      value={value}
      onChange={handleSelectChange}
      required
      disabled={loading}
      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 disabled:opacity-60"
    >
      {loading && <option value="">Loading…</option>}
      {!loading && value && !categories.some((c) => c.name === value) && (
        <option value={value}>{value}</option>
      )}
      {categories.map((cat) => (
        <option key={cat.id} value={cat.name}>
          {cat.name}
        </option>
      ))}
      <option value={ADD_NEW_VALUE}>+ Add new category…</option>
    </select>
  );
}
