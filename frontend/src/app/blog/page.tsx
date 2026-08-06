"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  published_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, published_at")
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header />

      <main className="pt-28 pb-20 px-6 lg:px-10">
        <div className="w-full max-w-6xl mx-auto">
          <header className="mb-12 lg:mb-14 max-w-2xl">
            <p className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-3">
              Journal
            </p>
            <h1 className="text-foreground text-3xl md:text-4xl font-semibold tracking-tight">
              From Our Studio
            </h1>
            <p className="mt-3 text-muted text-sm md:text-base leading-relaxed">
              Stories, ideas, and updates from Custom at Suka.
            </p>
          </header>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border/50 bg-white/60 overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-border/40" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-20 bg-border/60 rounded" />
                    <div className="h-5 w-3/4 bg-border/60 rounded" />
                    <div className="h-3 w-full bg-border/40 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/80 bg-white/50 px-8 py-16 text-center">
              <p className="text-foreground text-sm font-medium">No posts yet</p>
              <p className="text-muted text-sm mt-2">Check back soon for stories from our studio.</p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block border border-border/60 bg-white overflow-hidden transition-all duration-300 hover:border-accent/35 hover:bg-accent/[0.03]"
                >
                  <div className="relative aspect-[16/9] bg-[#f0efea] overflow-hidden">
                    <Image
                      src={post.cover_image_url || "/logo/logo-red.png"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    {post.published_at && (
                      <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-accent">
                        {formatDate(post.published_at)}
                      </p>
                    )}
                    <h2 className="text-foreground text-base font-semibold tracking-tight leading-snug group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
