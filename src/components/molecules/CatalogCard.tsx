"use client";

import { motion } from "framer-motion";
import { lineDrawVariants } from "@/lib/motion/variants";

type CatalogCardProps = {
  title: string;
  description: string;
  year?: string;
  pdfHref?: string;
  viewLabel: string;
  downloadLabel: string;
  soonLabel: string;
  compact?: boolean;
};

export function CatalogCard({
  title,
  description,
  year,
  pdfHref,
  viewLabel,
  downloadLabel,
  soonLabel,
  compact = false,
}: CatalogCardProps) {
  const hasPdf = Boolean(pdfHref);

  return (
    <motion.article
      className={`group relative flex h-full flex-col border border-navy-800 bg-ivory-50 ${
        compact ? "p-5 md:p-6" : "p-8"
      }`}
      initial="rest"
      whileHover="hover"
    >
      <motion.span
        variants={lineDrawVariants}
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gold-500"
        aria-hidden
      />
      {year ? (
        <span className="mb-4 inline-block w-fit border border-navy-800 bg-navy-950 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-gold-300">
          {year}
        </span>
      ) : null}
      <div
        className={`flex items-center justify-center border border-dashed border-navy-800/50 bg-ivory-100 ${
          compact ? "mb-4 aspect-[4/5]" : "mb-6 aspect-[3/4]"
        }`}
        aria-hidden
      >
        <span
          className={`font-display font-bold text-navy-950/15 ${
            compact ? "text-2xl md:text-3xl" : "text-4xl"
          }`}
        >
          PDF
        </span>
      </div>
      <h2
        className={`font-display font-bold tracking-tight text-navy-950 ${
          compact ? "text-base md:text-lg" : "text-xl md:text-2xl"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-2 flex-1 font-sans leading-relaxed text-navy-800/80 ${
          compact ? "text-xs md:text-sm" : "text-sm"
        }`}
      >
        {description}
      </p>
      <div className={`flex flex-wrap gap-2 ${compact ? "mt-4" : "mt-6 gap-3"}`}>
        {hasPdf ? (
          <>
            <a
              href={pdfHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block border border-gold-500 font-mono uppercase tracking-widest text-navy-950 transition-colors hover:bg-gold-500 ${
                compact ? "px-3 py-1.5 text-[10px]" : "px-5 py-2 text-xs"
              }`}
            >
              {viewLabel}
            </a>
            <a
              href={pdfHref}
              download
              className={`inline-block border border-navy-800 font-mono uppercase tracking-widest text-navy-950 transition-colors hover:border-gold-500 hover:text-gold-500 ${
                compact ? "px-3 py-1.5 text-[10px]" : "px-5 py-2 text-xs"
              }`}
            >
              {downloadLabel}
            </a>
          </>
        ) : (
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800/50">
            {soonLabel}
          </span>
        )}
      </div>
    </motion.article>
  );
}
