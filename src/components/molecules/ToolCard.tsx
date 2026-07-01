"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { lineDrawVariants } from "@/lib/motion/variants";
import type { ToolEntry } from "@/lib/tools";

type ToolCardProps = {
  tool: ToolEntry;
  title: string;
  description: string;
  openLabel: string;
  badge?: string;
  plannedLabel?: string;
};

export function ToolCard({
  tool,
  title,
  description,
  openLabel,
  badge,
  plannedLabel,
}: ToolCardProps) {
  const isPlanned = tool.planned === true;

  return (
    <motion.article
      className="group relative flex h-full flex-col border border-navy-800 bg-ivory-50 p-8 md:p-10"
      initial="rest"
      whileHover={isPlanned ? "rest" : "hover"}
    >
      <motion.span
        variants={lineDrawVariants}
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gold-500"
        aria-hidden
      />
      {badge ? (
        <span className="mb-4 inline-block w-fit border border-navy-800 bg-navy-950 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-gold-300">
          {badge}
        </span>
      ) : null}
      <h2 className="font-display text-2xl font-bold tracking-tight text-navy-950 md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-navy-800/80">
        {description}
      </p>
      {isPlanned ? (
        <span className="mt-6 inline-block w-fit border border-navy-800/40 px-5 py-2 font-mono text-xs uppercase tracking-widest text-navy-800/50">
          {plannedLabel ?? "—"}
        </span>
      ) : (
        <Link
          href={tool.href}
          className="mt-6 inline-block w-fit border border-gold-500 px-5 py-2 font-mono text-xs uppercase tracking-widest text-navy-950 transition-colors hover:bg-gold-500"
        >
          {openLabel} →
        </Link>
      )}
    </motion.article>
  );
}
