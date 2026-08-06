"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
} from "lucide-react";
import { BLOG_PROSE_CLASS } from "@/lib/blogProseClass";

const FONT_SIZES = [
  { label: "Small", value: "13px" },
  { label: "Normal", value: "" },
  { label: "Medium", value: "18px" },
  { label: "Large", value: "24px" },
  { label: "X-Large", value: "32px" },
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`p-2 rounded-lg transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-border/20"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  onUploadImage,
}: {
  editor: Editor;
  onUploadImage: (file: File) => Promise<string>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImageFile = async (file: File) => {
    const url = await onUploadImage(file);
    editor.chain().focus().setImage({ src: url }).run();
  };

  const currentFontSize = (editor.getAttributes("textStyle").fontSize as string | undefined) ?? "";

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-border/60 bg-[#f8f7f4] rounded-t-xl">
      <select
        aria-label="Font size"
        value={currentFontSize}
        onChange={(e) => {
          const value = e.target.value;
          if (value) editor.chain().focus().setFontSize(value).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
        className="h-8 px-2 rounded-lg border border-border/60 bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {FONT_SIZES.map((size) => (
          <option key={size.label} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>

      <div className="w-px h-5 bg-border/60 mx-1" />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-5 bg-border/60 mx-1" />

      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-5 bg-border/60 mx-1" />

      <ToolbarButton
        label="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Justify"
        active={editor.isActive({ textAlign: "justify" })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-5 bg-border/60 mx-1" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-5 bg-border/60 mx-1" />

      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={handleSetLink}>
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={() => fileInputRef.current?.click()}>
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
          e.target.value = "";
        }}
      />

      <div className="w-px h-5 bg-border/60 mx-1" />

      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}

export default function BlogEditor({
  content,
  onChange,
  onUploadImage,
}: {
  content: string;
  onChange: (html: string) => void;
  onUploadImage: (file: File) => Promise<string>;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      ImageExtension,
      Placeholder.configure({ placeholder: "Write your post…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontSize,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: `${BLOG_PROSE_CLASS} min-h-[320px] px-4 py-4 focus:outline-none rounded-b-xl`,
      },
    },
  });

  // Keep the editor in sync when the parent resets `content` (e.g. after fetching an existing post)
  const hasSyncedInitialContent = useRef(false);
  useEffect(() => {
    if (!editor || hasSyncedInitialContent.current) return;
    if (content) {
      editor.commands.setContent(content);
      hasSyncedInitialContent.current = true;
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-white">
      <Toolbar editor={editor} onUploadImage={onUploadImage} />
      <EditorContent editor={editor} />
    </div>
  );
}
