"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInView } from "@/lib/motion/variants";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
}

export function Reveal({
  children,
  className = "",
}: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20%" }}
      variants={fadeInView}
    >
      {children}
    </motion.div>
  );
}
