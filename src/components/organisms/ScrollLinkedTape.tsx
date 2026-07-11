"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function ScrollLinkedTape() {
  const t = useTranslations("home");
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  const lineScale = useTransform(scrollY, [0, 400], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative -mx-6 w-[calc(100%+3rem)] bg-navy-950 py-16 md:-mx-10 md:w-[calc(100%+5rem)] md:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-gold-300">
          {t("tapeLabel")}
        </p>

        <div className="relative h-px w-full overflow-hidden bg-navy-800">
          <motion.div
            className="absolute left-0 top-0 h-px origin-left bg-gold-500"
            style={
              reducedMotion
                ? { width: "100%" }
                : {
                    scaleX: lineScale,
                    width: "100vw",
                  }
            }
            aria-hidden
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f5f0e6 1px, transparent 1px), linear-gradient(to bottom, #f5f0e6 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
      </div>
    </section>
  );
}
