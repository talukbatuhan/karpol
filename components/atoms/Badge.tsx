import type { ReactNode } from "react";

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block border border-navy-800 bg-navy-950 px-3 py-1 font-mono text-xs uppercase tracking-widest text-gold-300 ${className}`}
    >
      {children}
    </span>
  );
}
