"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** When true, applies rounded full (e.g. avatars) */
  circle?: boolean;
};

/**
 * Block placeholder with pulse animation. Pair with `Spinner` when the whole
 * viewport loads vs inline content.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, circle, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse bg-[var(--steel-200)]",
        circle ? "rounded-full" : "rounded-[var(--radius-md)]",
        className,
      )}
      style={style}
      aria-hidden
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export type SkeletonTextProps = React.HTMLAttributes<HTMLDivElement> & {
  lines?: number;
};

/**
 * Stacked line placeholders for paragraphs or list rows.
 */
export function SkeletonText({
  className,
  lines = 3,
  style,
  ...props
}: SkeletonTextProps) {
  return (
    <div
      className={cn("flex w-full flex-col gap-2", className)}
      style={style}
      aria-hidden
      {...props}
    >
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3 w-full", i === lines - 1 && "w-4/5")}
        />
      ))}
    </div>
  );
}
