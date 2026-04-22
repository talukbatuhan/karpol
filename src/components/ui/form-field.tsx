"use client";

import { cn } from "@/lib/cn";

export type FormFieldProps = {
  className?: string;
  children: React.ReactNode;
};

export function FormField({ className, children }: FormFieldProps) {
  return <div className={cn(className)}>{children}</div>;
}
