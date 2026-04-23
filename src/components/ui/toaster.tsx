"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "@/lib/cn";

const baseToast =
  "group relative flex w-full max-w-[min(100%,22rem)] items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--ivory-border)] bg-[var(--ivory-surface)] p-3 pr-6 font-[var(--font-primary)] text-[var(--ivory-text-strong)] shadow-elevation-popover";

const defaultToastClassNames: NonNullable<ToasterProps["toastOptions"]>["classNames"] =
  {
    toast: baseToast,
    title: "text-sm font-semibold text-[var(--ivory-text-strong)]",
    description: "text-sm text-[var(--ivory-text-body)]",
    success: cn(
      baseToast,
      "border-[color-mix(in_srgb,var(--color-success)28%,var(--ivory-border))] [&_[data-icon]]:text-[var(--color-success)]",
    ),
    error: cn(
      baseToast,
      "border-[color-mix(in_srgb,var(--color-error)32%,var(--ivory-border))] [&_[data-icon]]:text-[var(--color-error)]",
    ),
    warning: cn(
      baseToast,
      "border-[color-mix(in_srgb,var(--color-warning)30%,var(--ivory-border))] [&_[data-icon]]:text-[var(--color-warning)]",
    ),
    info: cn(
      baseToast,
      "border-[color-mix(in_srgb,var(--color-info)28%,var(--ivory-border))] [&_[data-icon]]:text-[var(--color-info)]",
    ),
    closeButton:
      "absolute right-1.5 top-1.5 rounded-[var(--radius-sm)] border border-[var(--ivory-border)] bg-[var(--ivory-band-soft)] p-0.5 text-[var(--ivory-text-muted)] transition-colors hover:bg-[var(--ivory-surface)] hover:text-[var(--ivory-text-strong)]",
    actionButton:
      "rounded-[var(--radius-sm)] bg-[var(--ivory-accent)] px-2.5 py-1 text-xs font-medium !text-[var(--color-primary)] transition-opacity hover:opacity-90",
    cancelButton:
      "rounded-[var(--radius-sm)] border border-[var(--ivory-border)] bg-transparent px-2.5 py-1 text-xs text-[var(--ivory-text-body)]",
  };

/**
 * Toaster styled with premium `--ivory-*` / accent tokens (also flips with
 * `html[data-user-theme="dark"]` in `dark-overrides.css`). Mount once in the
 * root layout inside `ThemeProvider`. Use `toast` from `sonner` or the
 * re-export in `@/components/ui`.
 */
export function Toaster({ toastOptions, className, style, ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      richColors={false}
      className={cn("toaster-sonner", className)}
      style={{ zIndex: "var(--z-toast)", ...style }}
      closeButton
      offset={16}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...defaultToastClassNames,
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}
