"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/** SSR-safe: always `false` on the server and during hydration. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
