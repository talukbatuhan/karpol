import type { ReactNode } from "react";

export interface AtomBadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({
  children,
  className = "",
}: AtomBadgeProps) {
  return (
    <span
      className={`inline-block border border-navy-800 bg-navy-950 px-3 py-1 font-mono text-xs uppercase tracking-widest text-gold-300 ${className}`}
    >
      {children}
    </span>
  );
}
