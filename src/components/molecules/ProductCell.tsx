"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { lineDrawVariants } from "@/lib/motion/variants";

type ProductCellProps = {
  title: string;
  description: string;
  href:
    | "/tools/makara"
    | "/tools/kaucuk-titresim-takozlari"
    | "/tools/silim-lastigi";
};

export function ProductCell({ title, description, href }: ProductCellProps) {
  return (
    <motion.article
      className="group relative border border-navy-800 bg-ivory-50 p-8 md:p-10"
      initial="rest"
      whileHover="hover"
    >
      <motion.span
        variants={lineDrawVariants}
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gold-500"
        aria-hidden
      />
      <motion.span
        variants={lineDrawVariants}
        className="pointer-events-none absolute inset-y-0 right-0 w-px origin-top bg-gold-500"
        aria-hidden
      />
      <h3 className="font-display text-2xl font-bold tracking-tight text-navy-950 md:text-3xl">
        {title}
      </h3>
      <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-navy-800/80">
        {description}
      </p>
      <Link
        href={href}
        className="mt-6 inline-block border border-gold-500 px-5 py-2 font-mono text-xs uppercase tracking-widest text-navy-950 transition-colors hover:bg-gold-500 hover:text-navy-950"
      >
        →
      </Link>
    </motion.article>
  );
}
