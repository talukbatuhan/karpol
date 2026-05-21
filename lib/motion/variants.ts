import type { Variants, Transition } from "framer-motion";

export const cinematicEase = [0.65, 0, 0.35, 1] as const;

export const cinematicTransition: Transition = {
  duration: 0.5,
  ease: cinematicEase,
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: cinematicTransition,
  },
};

export const wordRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
};

export const wordRevealItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: cinematicEase,
    },
  },
};

export const fadeInView: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: cinematicTransition,
  },
};

export const lineDrawVariants: Variants = {
  rest: { scaleX: 0 },
  hover: {
    scaleX: 1,
    transition: { duration: 0.35, ease: cinematicEase },
  },
};

export const navUnderline: Variants = {
  rest: { scaleX: 0, opacity: 0 },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: cinematicEase },
  },
};
