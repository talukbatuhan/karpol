"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ToolCard } from "@/components/molecules/ToolCard";
import { Link } from "@/i18n/routing";
import { tools } from "@/lib/tools";
import { fadeInView } from "@/lib/motion/variants";

export function MaterialIndex() {
  const t = useTranslations("home");
  const tTools = useTranslations("tools");
  const tCommon = useTranslations("toolsCommon");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
      variants={fadeInView}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-navy-800">
          {t("indexTitle")}
        </h2>
        <Link
          href="/tools"
          className="font-mono text-xs uppercase tracking-widest text-gold-500 hover:text-navy-950"
        >
          {tCommon("open")} →
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8">
        {tools.map((tool) => (
          <div key={tool.id} className="col-span-12 md:col-span-6">
            <ToolCard
              tool={tool}
              title={tTools(`${tool.messageKey}.title`)}
              description={tTools(`${tool.messageKey}.description`)}
              openLabel={tCommon("open")}
              badge={
                tool.kind === "legacy-html"
                  ? tCommon("badgeLegacy")
                  : tCommon("badge3d")
              }
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
