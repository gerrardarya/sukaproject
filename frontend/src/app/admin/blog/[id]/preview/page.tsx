import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostView from "@/components/BlogPostView";
import { supabase } from "@/lib/supabase";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const postId = Number(id);
  if (Number.isNaN(postId)) notFound();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", postId)
    .maybeSingle();

  if (error || !post) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />

      {!post.is_active && (
        <div className="bg-amber-100 text-amber-800 text-sm font-medium text-center py-2.5 px-6">
          Draft preview — this post is not published yet.
        </div>
      )}

      <BlogPostView post={post} />
      <Footer />
    </div>
  );
}
