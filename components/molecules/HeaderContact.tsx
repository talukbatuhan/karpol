"use client";

import { useTranslations } from "next-intl";

export function HeaderContact() {
  const t = useTranslations("header");

  return (
    <div className="shrink-0 text-right font-sans text-[0.7rem] leading-snug text-navy-950/90 sm:text-xs">
      <p className="font-semibold tracking-wide">{t("companyName")}</p>
      <p className="mt-0.5 text-navy-800/85">{t("addressLine1")}</p>
      <p className="mt-0.5 text-navy-800/85">{t("addressLine2")}</p>
      <a
        href={t("phoneHref")}
        className="mt-1 inline-block font-mono text-navy-950 transition-colors hover:text-gold-500"
      >
        {t("phone")}
      </a>
    </div>
  );
}
