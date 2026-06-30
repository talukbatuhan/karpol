"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { lineDrawVariants } from "@/lib/motion/variants";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";

type EcatalogCardProps = {
  slug: string;
  title: string;
  description: string;
  year?: string;
  coverImage?: string | null;
  readLabel: string;
  pagesLabel?: string;
  spreadCount?: number;
};

export function EcatalogCard({
  slug,
  title,
  description,
  year,
  coverImage,
  readLabel,
  pagesLabel,
  spreadCount,
}: EcatalogCardProps) {
  return (
    <motion.article
      className="group relative flex h-full flex-col border border-navy-800 bg-ivory-50 p-5 md:p-6"
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
      <div className="relative mb-4 aspect-[3/4] overflow-hidden border border-navy-800/40 bg-navy-950 shadow-[8px_8px_0_rgba(6,14,26,0.12)]">
        {coverImage ? (
          <ProportionalProductImage
            src={coverImage}
            alt=""
            sizes="(max-width: 768px) 50vw, 25vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950">
            <span className="font-display text-3xl font-bold text-gold-500/30">
              K
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-ivory-50/10" aria-hidden />
      </div>
      <h2 className="font-display text-base font-bold tracking-tight text-navy-950 md:text-lg">
        {title}
      </h2>
      <p className="mt-2 flex-1 font-sans text-xs leading-relaxed text-navy-800/80 md:text-sm">
        {description}
      </p>
      {spreadCount && pagesLabel ? (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-navy-800/55">
          {pagesLabel}
        </p>
      ) : null}
      <div className="mt-4">
        <Link
          href={`/e-katalog/${slug}`}
          className="inline-block border border-gold-500 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-navy-950 transition-colors hover:bg-gold-500 md:text-xs"
        >
          {readLabel}
        </Link>
      </div>
    </motion.article>
  );
}
