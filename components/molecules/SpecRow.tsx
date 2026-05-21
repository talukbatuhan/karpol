"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInView } from "@/lib/motion/variants";

type SpecRowProps = {
  label: string;
  value: string;
};

export function SpecRow({ label, value }: SpecRowProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="relative border-b border-navy-800/20 py-4 pl-4"
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInView}
    >
      <motion.span
        className="absolute left-0 top-0 h-full w-0.5 origin-top bg-gold-500"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
        aria-hidden
      />
      <dt className="font-mono text-xs uppercase tracking-widest text-navy-800/70">
        {label}
      </dt>
      <dd className="mt-1 font-sans text-sm text-navy-950">{value}</dd>
    </motion.div>
  );
}
