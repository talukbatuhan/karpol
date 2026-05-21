"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { NavLink } from "@/components/molecules/NavLink";
import { LocaleSwitch } from "@/components/molecules/LocaleSwitch";
import { HeaderContact } from "@/components/molecules/HeaderContact";
import { HeaderCatalogLink } from "@/components/molecules/HeaderCatalogLink";
import { HeaderSocialLinks } from "@/components/molecules/HeaderSocialLinks";
import { Rule } from "@/components/atoms/Rule";

export function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");

  return (
    <header className="sticky top-0 z-50 bg-navy-950">
      <div className="border-b border-navy-800 bg-ivory-50">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-start justify-between gap-x-4 gap-y-3 py-2.5 pl-6 pr-6 md:gap-x-6 md:pr-10">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label={tBrand("name")}
            >
              <img
                src="/karpol-logo-nav.png"
                alt=""
                width={2025}
                height={510}
                decoding="async"
                fetchPriority="high"
                className="h-9 w-auto bg-transparent object-contain drop-shadow-md transition-[filter] duration-200 hover:brightness-110 md:h-10"
              />
            </Link>
            <p className="hidden min-w-0 flex-1 font-sans text-sm leading-snug text-navy-950/85 sm:block md:text-[0.9375rem]">
              {tBrand("headerSlogan")}
            </p>
          </div>
          <HeaderContact />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-12 items-center gap-4 py-3 pl-6 pr-6 md:pr-10">
        <nav className="col-span-12 hidden items-center justify-center gap-6 lg:col-span-9 lg:flex lg:justify-start lg:gap-8">
          <NavLink href="/" label={t("home")} />
          <NavLink href="/about" label={t("about")} />
          <NavLink href="/products" label={t("products")} />
          <NavLink href="/tools" label={t("tools")} />
          <NavLink href="/contact" label={t("contact")} />
        </nav>

        <div className="col-span-12 flex items-center justify-end gap-3 lg:col-span-3">
          <HeaderCatalogLink />
          <HeaderSocialLinks />
          <LocaleSwitch />
        </div>
      </div>
      <Rule className="w-full" />
    </header>
  );
}
