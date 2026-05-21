"use client";

import { motion, useReducedMotion } from "framer-motion";
import { wordRevealContainer, wordRevealItem } from "@/lib/motion/variants";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const reducedMotion = useReducedMotion();
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <header className="col-span-12 border-l-4 border-gold-500 pl-6 md:pl-10">
      <motion.h1
        className="font-display text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight tracking-tight text-navy-950"
        variants={wordRevealContainer}
        initial={reducedMotion ? "visible" : "hidden"}
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={wordRevealItem}
            className="mr-[0.25em] inline-block"
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>
      {subtitle ? (
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-navy-800/80 md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
