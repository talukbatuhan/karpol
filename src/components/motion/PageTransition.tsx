"use client";

import { motion, useReducedMotion } from "framer-motion";
import { pageTransition } from "@/lib/motion/variants";

export interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">{children}</div>
    );
  }

  return (
    <motion.div
      className="flex min-h-0 w-full flex-1 flex-col"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
}
