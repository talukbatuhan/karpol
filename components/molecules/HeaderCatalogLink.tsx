"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

export function HeaderCatalogLink() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isActive = pathname === "/e-katalog" || pathname.startsWith("/e-katalog/");

  return (
    <Link
      href="/e-katalog"
      className={`inline-flex h-8 shrink-0 items-center border px-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
        isActive
          ? "border-gold-500 text-gold-500"
          : "border-gold-500/50 text-ivory-100 hover:border-gold-500 hover:text-gold-300"
      }`}
    >
      {t("ecatalog")}
    </Link>
  );
}
