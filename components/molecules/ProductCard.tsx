"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { lineDrawVariants } from "@/lib/motion/variants";

type ProductCardProps = {
  title: string;
  description: string;
  slug: string;
  viewLabel: string;
};

export function ProductCard({
  title,
  description,
  slug,
  viewLabel,
}: ProductCardProps) {
  return (
    <motion.article
      className="group relative flex h-full flex-col border border-navy-800 bg-ivory-50 p-8"
      initial="rest"
      whileHover="hover"
    >
      <motion.span
        variants={lineDrawVariants}
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gold-500"
        aria-hidden
      />
      <h2 className="font-display text-2xl font-bold tracking-tight text-navy-950">
        {title}
      </h2>
      <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-navy-800/80">
        {description}
      </p>
      <Link
        href={`/products/${slug}`}
        className="mt-6 inline-block w-fit border border-gold-500 px-5 py-2 font-mono text-xs uppercase tracking-widest text-navy-950 transition-colors hover:bg-gold-500"
      >
        {viewLabel} →
      </Link>
    </motion.article>
  );
}
