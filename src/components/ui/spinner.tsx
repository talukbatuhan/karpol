"use client";

import { cn } from "@/lib/cn";

export type SpinnerProps = {
  className?: string;
  /** Pixel size (width & height) */
  size?: number;
};

export function Spinner({ className, size = 16 }: SpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-2 border-[rgba(8,10,14,0.25)] border-t-[var(--color-white,white)]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}
