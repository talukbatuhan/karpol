"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { wordRevealContainer, wordRevealItem } from "@/lib/motion/variants";

export function TypographicManifest() {
  const t = useTranslations("brand");
  const tHome = useTranslations("home");
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const words = t("slogan").split(/\s+/).filter(Boolean);

  return (
    <motion.section
      ref={ref}
      style={reducedMotion ? undefined : { scale }}
      className="relative border-l-4 border-gold-500 pl-6 md:pl-10"
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-navy-800/70">
        {tHome("metric")}
      </p>

      <motion.h1
        className="font-display text-[clamp(2rem,8vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight text-navy-950"
        variants={wordRevealContainer}
        initial={reducedMotion ? "visible" : "hidden"}
        animate="visible"
        aria-label={t("slogan")}
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={wordRevealItem}
            className="mr-[0.25em] inline-block last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      <p className="mt-8 font-display text-lg font-semibold text-gold-500 md:text-xl">
        {t("name")}
      </p>
    </motion.section>
  );
}
