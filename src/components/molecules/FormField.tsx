import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  error?: string;
}

export function FormField({
  label,
  htmlFor,
  children,
  className,
  error,
}: FormFieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label
        htmlFor={htmlFor}
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
