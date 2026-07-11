"use client";

import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface ProportionalProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fill?: boolean;
  onLoad?: ImageProps["onLoad"];
}

/** Vercel Image Optimization (/_next/image) harici URL'lerde 402 verebilir; doğrudan sun. */
function isExternallyHosted(src: string): boolean {
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.includes("supabase.co")
  );
}

export function ProportionalProductImage({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  className = "",
  fill = false,
  onLoad,
}: ProportionalProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : 0}
      height={fill ? undefined : 0}
      fill={fill}
      sizes={sizes}
      priority={priority}
      decoding="async"
      unoptimized={isExternallyHosted(src)}
      onLoad={onLoad}
      className={cn(
        fill
          ? "object-contain"
          : "block h-auto w-full max-w-full",
        className,
      )}
      style={fill ? undefined : { width: "100%", height: "auto" }}
    />
  );
}
