"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { deleteClient, toggleClientActive } from "../actions";
import AdminSidebar from "../components/AdminSidebar";
import { Plus, ToggleLeft, ToggleRight, Trash2, Pencil, Building2 } from "lucide-react";

type Client = {
  id: number;
  name: string;
  logo_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleToggleActive = async (client: Client) => {
    await toggleClientActive(client.id, !client.is_active);
    fetchClients();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this client? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteClient(id);
    setDeletingId(null);
    fetchClients();
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
            <p className="text-sm text-muted mt-1">
              {clients.length} client{clients.length !== 1 ? "s" : ""} — shown in the &ldquo;Trusted by&rdquo; ticker
            </p>
          </div>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Building2 className="w-12 h-12 text-muted/30 mb-4" />
            <p className="text-muted font-medium">No clients yet</p>
            <p className="text-sm text-muted/70 mt-1">Add your first client to populate the &ldquo;Trusted by&rdquo; section</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f7f4] border-b border-border/40">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Logo</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Order</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#f8f7f4]/50 transition-colors">
                    <td className="px-5 py-4">
                      {client.logo_url ? (
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-border/30 bg-white flex-shrink-0">
                          <Image
                            src={client.logo_url}
                            alt={client.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded-lg bg-border/20 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-muted/40" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{client.name}</p>
                      {!client.logo_url && (
                        <p className="text-[10px] text-muted/50 mt-0.5">No logo — shows name in ticker</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-border/20 text-muted">
                        #{client.sort_order}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(client)}
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      >
                        {client.is_active ? (
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
                          href={`/admin/clients/${client.id}/edit`}
                          className="p-2 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(client.id)}
                          disabled={deletingId === client.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-all duration-200 disabled:opacity-40"
                        >
                          {deletingId === client.id ? (
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
