"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInView } from "@/lib/motion/variants";

const specKeys = ["solutions", "experience", "quality"] as const;

export function SpecStrip() {
  const t = useTranslations("home");
  const tBrand = useTranslations("brand");

  const items: Record<(typeof specKeys)[number], string> = {
    solutions: tBrand("slogan"),
    experience: "ISO 9001 · mühendislik desteği",
    quality: "Poliüretan · kauçuk · özel formülasyon",
  };

  return (
    <div className="grid grid-cols-12 gap-6 md:gap-8">
      <motion.div
        className="col-span-12 border border-navy-800 bg-ivory-100 p-8 md:col-span-8 md:p-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInView}
      >
        <h2 className="font-display text-2xl font-bold text-navy-950 md:text-3xl">
          {t("specTitle")}
        </h2>
        <ul className="mt-8 space-y-4">
          {specKeys.map((key) => (
            <li
              key={key}
              className="relative border-l-2 border-gold-500 pl-4 font-sans text-sm leading-relaxed text-navy-800"
            >
              {items[key]}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.aside
        className="col-span-12 flex flex-col justify-between border border-gold-500 bg-navy-950 p-8 md:col-span-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInView}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-gold-300">
          Karpol
        </p>
        <p className="mt-6 font-display text-xl font-bold text-ivory-50">
          {tBrand("name")}
        </p>
        <a
          href="https://www.karpol.net"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block border border-gold-500 px-5 py-3 text-center font-mono text-xs uppercase tracking-widest text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950"
        >
          karpol.net →
        </a>
      </motion.aside>
    </div>
  );
}
