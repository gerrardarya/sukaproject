"use client";

import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductPreviewCard({
  name,
  description,
  category,
  price,
  imagePreview,
  isLocalFile,
  fileName,
  onReplace,
  onRemove,
}: {
  name: string;
  description: string;
  category: string;
  price: string;
  imagePreview: string;
  isLocalFile: boolean;
  fileName?: string;
  onReplace?: () => void;
  onRemove?: () => void;
}) {
  const numericPrice = parseFloat(price);
  const hasPrice = !isNaN(numericPrice) && numericPrice > 0;

  return (
    <div className="border border-border/60 bg-white overflow-hidden shadow-sm">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#f0efea] overflow-hidden">
        {imagePreview ? (
          <>
            <Image
              src={imagePreview}
              alt={name || "Preview"}
              fill
              className="object-cover transition-opacity duration-300"
              unoptimized={isLocalFile || imagePreview.startsWith("blob:")}
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent opacity-80" />
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-muted hover:text-red-500 shadow-sm transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {onReplace && (
              <button
                type="button"
                onClick={onReplace}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-medium text-muted hover:text-accent shadow-sm transition-all duration-200"
              >
                <Upload className="w-3 h-3" />
                Replace
              </button>
            )}
            {fileName && (
              <div className="absolute bottom-2 left-2 max-w-[55%] truncate px-2.5 py-1 rounded-full bg-white/90 text-xs text-muted font-medium shadow-sm">
                {fileName}
              </div>
            )}
          </>
        ) : onReplace ? (
          <button
            type="button"
            onClick={onReplace}
            className="flex flex-col items-center justify-center w-full h-full gap-2 cursor-pointer hover:bg-accent/5 transition-colors duration-200 group"
          >
            <Upload className="w-8 h-8 text-border/60 group-hover:text-accent transition-colors duration-200" />
            <p className="text-xs text-muted/60 group-hover:text-accent transition-colors duration-200 font-medium">
              Click to upload image
            </p>
            <p className="text-[10px] text-muted/40">PNG, JPG, WEBP up to 10MB</p>
          </button>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-2 text-muted/40">
            <ImageIcon className="w-8 h-8" />
            <p className="text-xs font-medium">No image yet</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        {category && (
          <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-accent line-clamp-1">
            {category}
          </p>
        )}
        <h3 className="text-foreground text-sm font-semibold leading-snug tracking-tight line-clamp-2 min-h-[2.5rem]">
          {name || <span className="text-muted/40 font-normal">Product name…</span>}
        </h3>
        <p className="text-muted text-xs leading-relaxed whitespace-pre-line line-clamp-2 min-h-[2rem]">
          {description || <span className="text-muted/30">Description will appear here…</span>}
        </p>
        {hasPrice && (
          <p className="text-foreground/80 text-sm font-medium pt-0.5">
            {formatPrice(numericPrice)}
          </p>
        )}
      </div>
    </div>
  );
}
