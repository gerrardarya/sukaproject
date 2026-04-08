"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase, Product } from "@/lib/supabase";
import { deleteProduct, toggleProductActive } from "./actions";
import AdminSidebar from "./components/AdminSidebar";
import { Plus, ToggleLeft, ToggleRight, Trash2, Pencil, Package } from "lucide-react";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleActive = async (product: Product) => {
    await toggleProductActive(product.id!, !product.is_active);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
    fetchProducts();
  };

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Products</h1>
            <p className="text-sm text-muted mt-1">{products.length} total products</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-accent text-white"
                  : "bg-white border border-border/50 text-muted hover:border-accent/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="w-12 h-12 text-muted/30 mb-4" />
            <p className="text-muted font-medium">No products yet</p>
            <p className="text-sm text-muted/70 mt-1">Add your first product to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f7f4] border-b border-border/40">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Product</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Price</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f8f7f4]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border/30">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-border/20 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-muted/40" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted line-clamp-1 max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-foreground font-medium">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      >
                        {product.is_active ? (
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
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id!)}
                          disabled={deletingId === product.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-all duration-200 disabled:opacity-40"
                        >
                          {deletingId === product.id ? (
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
