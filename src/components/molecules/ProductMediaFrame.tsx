import type { ReactNode } from "react";

export interface ProductMediaFrameProps {
  title: string;
  caption?: string;
  children: ReactNode;
}

export function ProductMediaFrame({
  title,
  caption,
  children,
}: ProductMediaFrameProps) {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-navy-800/70">
        {title}
      </p>
      {caption ? (
        <p className="mb-2 text-xs leading-relaxed text-navy-800/60">{caption}</p>
      ) : null}
      <div className="w-full overflow-hidden border border-navy-800/30 bg-navy-950/5">
        {children}
      </div>
    </div>
  );
}
