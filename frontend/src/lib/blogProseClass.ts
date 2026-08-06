// Shared typography for rendered blog HTML — used by both the Tiptap editor
// (admin) and the public post page, so what you write is what renders.
export const BLOG_PROSE_CLASS = [
  "text-foreground text-base leading-relaxed",
  "[&_p]:mb-4 [&_p:last-child]:mb-0",
  "[&_h2]:font-serif [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-normal [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4",
  "[&_h3]:font-serif [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-normal [&_h3]:tracking-tight [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_blockquote]:my-4",
  "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2",
  "[&_img]:rounded-xl [&_img]:my-6",
  "[&_strong]:font-semibold",
  "[&_code]:bg-border/20 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm",
  "[&_hr]:border-border/60 [&_hr]:my-8",
].join(" ");
