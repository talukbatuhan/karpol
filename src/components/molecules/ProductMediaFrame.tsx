import type { ReactNode } from "react";

export interface ProductMediaFrameProps {
  title: string;
  caption?: string;
  titleEnd?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function ProductMediaFrame({
  title,
  caption,
  titleEnd,
  footer,
  children,
}: ProductMediaFrameProps) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-navy-800/70">
          {title}
        </p>
        {titleEnd ? (
          <div className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-navy-800/55">
            {titleEnd}
          </div>
        ) : null}
      </div>
      {caption ? (
        <p className="mb-2 text-xs leading-relaxed text-navy-800/60">{caption}</p>
      ) : null}
      <div className="w-full overflow-hidden border border-navy-800/30 bg-navy-950/5">
        {children}
      </div>
      {footer ? <div className="mt-2">{footer}</div> : null}
    </div>
  );
}
