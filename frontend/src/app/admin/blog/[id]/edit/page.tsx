"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { updateBlogPost } from "../../../actions";
import { slugifyBlogTitle } from "@/lib/slugify";
import ImagePicker from "../../../components/ImagePicker";
import BlogEditor from "../../../components/BlogEditor";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
}

export default function EditBlogPostPage() {
  const { id } = useParams();
  const postId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [coverPreview, setCoverPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (!error && data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt ?? "");
        setContent(data.content_html ?? "");
        setIsActive(data.is_active);
        setCoverPreview(data.cover_image_url ?? "");
      }
      setLoading(false);
    };

    if (postId) fetchPost();
  }, [postId]);

  const markDirty = () => setSuccess(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyBlogTitle(value));
    markDirty();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      let cover_image_url = coverPreview;
      if (coverFile) cover_image_url = await uploadImage(coverFile);

      const { slug: newSlug } = await updateBlogPost(postId, {
        title,
        slug,
        excerpt,
        content_html: content,
        cover_image_url,
        is_active: isActive,
      });

      setCoverFile(null);
      setCoverPreview(cover_image_url);
      setSlug(newSlug);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    }
    setSaving(false);
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/blog"
            className="p-2 rounded-xl bg-white border border-border/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground">Edit Post</h1>
            <p className="text-sm text-muted mt-0.5">Update this blog post</p>
          </div>
          <Link
            href={`/admin/blog/${postId}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-accent hover:text-accent/70 transition-colors duration-200"
          >
            Preview
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm space-y-5">
            <ImagePicker
              label="Cover image"
              preview={coverPreview}
              aspect="aspect-[16/9]"
              onFile={(f) => {
                setCoverFile(f);
                setCoverPreview(URL.createObjectURL(f));
                markDirty();
              }}
              onRemove={() => {
                setCoverFile(null);
                setCoverPreview("");
                markDirty();
              }}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="title">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(slugifyBlogTitle(e.target.value));
                  setSlugTouched(true);
                  markDirty();
                }}
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
              />
              <p className="text-xs text-muted">The page lives at /blog/{slug || "…"}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="excerpt">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  markDirty();
                }}
                rows={2}
                placeholder="A short summary shown on the blog listing"
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-none"
              />
            </div>

            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#f8f7f4] border border-border/40">
              <div>
                <p className="text-sm font-medium text-foreground">Published</p>
                <p className="text-xs text-muted mt-0.5">Show this post on the public blog</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => {
                    setIsActive(e.target.checked);
                    markDirty();
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-border/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Content <span className="text-red-400">*</span>
            </label>
            <BlogEditor
              content={content}
              onChange={(html) => {
                setContent(html);
                markDirty();
              }}
              onUploadImage={uploadImage}
            />
          </div>

          {success && (
            <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm">
              Post updated.
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/admin/blog"
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
                  Update Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
