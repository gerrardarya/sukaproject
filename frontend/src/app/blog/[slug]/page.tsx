import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostView from "@/components/BlogPostView";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (!isSupabaseConfigured()) return [];

  const { data } = await supabase.from("blog_posts").select("slug").eq("is_active", true);

  return (data ?? []).map((row: { slug: string }) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!post) return {};
  return {
    title: `${post.title} — Custom at Suka`,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !post) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />
      <BlogPostView post={post} />
      <Footer />
    </div>
  );
}
