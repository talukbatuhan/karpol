"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

export function LocaleSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale = locale === "tr" ? "en" : "tr";

  return (
    <motion.button
      type="button"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-gold-500/50 font-mono text-[10px] uppercase tracking-wider text-ivory-100 transition-colors hover:border-gold-500 hover:text-gold-300"
      whileTap={{ opacity: 0.7 }}
      aria-label={`Switch to ${nextLocale}`}
    >
      {locale === "tr" ? "EN" : "TR"}
    </motion.button>
  );
}
