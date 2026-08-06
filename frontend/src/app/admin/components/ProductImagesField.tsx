"use client";

import { useRef } from "react";
import Image from "next/image";
import { GripVertical, ImagePlus, X } from "lucide-react";

export type ProductImageItem = {
  id: string;
  url: string;
  file?: File;
};

export default function ProductImagesField({
  images,
  onChange,
}: {
  images: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const additions: ProductImageItem[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      file,
    }));
    onChange([...images, ...additions]);
  };

  const handleRemove = (id: string) => {
    const target = images.find((img) => img.id === id);
    if (target?.file) URL.revokeObjectURL(target.url);
    onChange(images.filter((img) => img.id !== id));
  };

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;

    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    dragIndexRef.current = index;
    onChange(next);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => e.preventDefault()}
            onDragEnd={handleDragEnd}
            className="relative aspect-square rounded-xl overflow-hidden border border-border/60 bg-[#f0efea] group cursor-grab active:cursor-grabbing"
          >
            <Image
              src={img.url}
              alt=""
              fill
              className="object-cover"
              unoptimized={Boolean(img.file) || img.url.startsWith("blob:")}
              sizes="120px"
            />
            {index === 0 && (
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-accent text-white text-[9px] font-medium tracking-wide uppercase">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/90 hover:bg-white text-muted hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-white/80 text-muted/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <GripVertical className="w-3 h-3" />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-border/50 bg-[#f8f7f4] hover:border-accent/50 hover:bg-accent/5 flex flex-col items-center justify-center gap-1.5 text-muted hover:text-accent transition-all duration-200"
        >
          <ImagePlus className="w-5 h-5" />
          <span className="text-[10px] font-medium">Add</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />

      <p className="text-[10px] text-muted/50">
        {images.length === 0
          ? "No images yet — add at least one."
          : "Drag to reorder · first image is the cover shown in the catalogue."}
      </p>
    </div>
  );
}
