import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BLOG_PROSE_CLASS } from "@/lib/blogProseClass";

export type BlogPostData = {
  title: string;
  content_html: string;
  cover_image_url: string | null;
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

export default function BlogPostView({ post }: { post: BlogPostData }) {
  return (
    <main className="flex-1 pt-24 pb-24 px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to journal
        </Link>

        <nav className="mb-8 flex items-center gap-1.5 text-xs text-muted">
          <Link href="/" className="hover:text-accent transition-colors duration-200">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 opacity-50" />
          <Link href="/blog" className="hover:text-accent transition-colors duration-200">
            Journal
          </Link>
          <ChevronRight className="w-3 h-3 opacity-50" />
          <span className="text-foreground/60 truncate max-w-[220px]">{post.title}</span>
        </nav>

        {post.published_at && (
          <p className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-3">
            {formatDate(post.published_at)}
          </p>
        )}

        <h1 className="font-serif text-3xl lg:text-5xl text-foreground font-normal tracking-tight leading-[1.15] mb-8">
          {post.title}
        </h1>

        {post.cover_image_url && (
          <div className="relative aspect-[16/9] overflow-hidden border border-border/40 bg-white mb-10">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className={BLOG_PROSE_CLASS} dangerouslySetInnerHTML={{ __html: post.content_html }} />
      </div>
    </main>
  );
}
