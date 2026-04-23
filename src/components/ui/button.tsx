"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-[inherit]",
        "transition-[transform,opacity] duration-150 ease-[var(--ease-spring)]",
        "enabled:active:scale-[0.98]",
        "motion-reduce:transition-opacity motion-reduce:duration-100",
        "enabled:motion-reduce:active:scale-100 enabled:motion-reduce:active:opacity-90",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
