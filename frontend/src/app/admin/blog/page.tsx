"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { deleteBlogPost, toggleBlogPostActive } from "../actions";
import AdminSidebar from "../components/AdminSidebar";
import { Plus, ToggleLeft, ToggleRight, Trash2, Pencil, Newspaper } from "lucide-react";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleToggleActive = async (post: BlogPost) => {
    await toggleBlogPostActive(post.id, !post.is_active);
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(id);
    await deleteBlogPost(id);
    setDeletingId(null);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Blog</h1>
            <p className="text-sm text-muted mt-1">{posts.length} total posts</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Newspaper className="w-12 h-12 text-muted/30 mb-4" />
            <p className="text-muted font-medium">No posts yet</p>
            <p className="text-sm text-muted/70 mt-1">Write your first post to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f7f4] border-b border-border/40">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Post</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Published</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                    className="hover:bg-[#f8f7f4]/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {post.cover_image_url ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border/30">
                            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-border/20 flex items-center justify-center flex-shrink-0">
                            <Newspaper className="w-4 h-4 text-muted/40" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{post.title}</p>
                          <p className="text-xs text-muted line-clamp-1 max-w-[280px]">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">{formatDate(post.published_at)}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(post);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      >
                        {post.is_active ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-green-500" />
                            <span className="text-green-600">Published</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-muted" />
                            <span className="text-muted">Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deletingId === post.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-all duration-200 disabled:opacity-40"
                        >
                          {deletingId === post.id ? (
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
