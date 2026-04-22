"use client";

import { cn } from "@/lib/cn";

export type FormAlertProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Inline field errors (border). */
  variant?: "destructive" | "default" | "adminBanner";
};

export function FormAlert({
  className,
  variant = "destructive",
  children,
  ...props
}: FormAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        variant === "destructive" &&
          "rounded-lg border border-red-500/35 bg-red-500/10 px-3.5 py-2.5 text-[13px] leading-snug text-red-600",
        variant === "adminBanner" &&
          "mb-5 rounded-lg bg-[#fee2e2] px-4 py-3 text-sm text-[#991b1b]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
