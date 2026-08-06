"use client";

import { useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

export default function ImagePicker({
  label,
  preview,
  onFile,
  onRemove,
  aspect = "aspect-[4/5]",
}: {
  label: string;
  preview: string;
  onFile: (file: File) => void;
  onRemove: () => void;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-3">{label}</p>
      <div
        className={`relative ${aspect} rounded-xl overflow-hidden border border-border/40 bg-[#f8f7f4]`}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover"
              unoptimized={preview.startsWith("blob:")}
              sizes="300px"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-muted hover:text-red-500 shadow-sm transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-medium text-muted hover:text-accent shadow-sm transition-all duration-200"
            >
              <Upload className="w-3 h-3" />
              Replace
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-full gap-2 cursor-pointer hover:bg-accent/5 transition-colors duration-200 group"
          >
            <Upload className="w-6 h-6 text-border group-hover:text-accent transition-colors duration-200" />
            <p className="text-xs text-muted/60 group-hover:text-accent transition-colors duration-200 font-medium">
              Click to upload
            </p>
            <p className="text-[10px] text-muted/40">PNG, JPG, WEBP</p>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}
