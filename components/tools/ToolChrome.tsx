"use client";

import { Link } from "@/i18n/routing";

type ToolChromeProps = {
  title: string;
  backLabel: string;
  backHref?: "/" | "/products" | "/tools";
};

export function ToolChrome({
  title,
  backLabel,
  backHref = "/products",
}: ToolChromeProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-navy-800 bg-navy-950 px-4 py-3 md:px-6">
      <Link
        href={backHref}
        className="font-mono text-xs uppercase tracking-widest text-gold-300 transition-colors hover:text-gold-500"
      >
        ← {backLabel}
      </Link>
      <h1 className="font-display text-sm font-bold uppercase tracking-wide text-ivory-50 md:text-base">
        {title}
      </h1>
      <span className="w-16" aria-hidden />
    </div>
  );
}
