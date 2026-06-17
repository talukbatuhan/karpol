"use client";

import { useTranslations } from "next-intl";

type HeaderContactProps = {
  className?: string;
};

export function HeaderContact({ className = "" }: HeaderContactProps) {
  const t = useTranslations("header");

  return (
    <div
      className={`shrink-0 font-sans text-[0.7rem] leading-snug text-navy-950/90 sm:text-xs ${className}`}
    >
      <p className="font-semibold tracking-wide">{t("companyName")}</p>
      <p className="mt-0.5 flex flex-col items-start gap-0.5 text-left sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-0.5">
        <span className="hidden sm:inline">
          {t("addressLine1")}, {t("addressLine2")}
        </span>
        <span className="hidden text-gold-500/80 sm:inline" aria-hidden>
          ·
        </span>
        <a
          href={t("phoneHref")}
          className="font-mono text-navy-950 transition-colors hover:text-gold-500"
        >
          {t("phone")}
        </a>
      </p>
    </div>
  );
}
