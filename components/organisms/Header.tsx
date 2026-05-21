"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { NavLink } from "@/components/molecules/NavLink";
import { LocaleSwitch } from "@/components/molecules/LocaleSwitch";
import { HeaderContact } from "@/components/molecules/HeaderContact";
import { HeaderCatalogLink } from "@/components/molecules/HeaderCatalogLink";
import { HeaderSocialLinks } from "@/components/molecules/HeaderSocialLinks";
import { Rule } from "@/components/atoms/Rule";

const SCROLL_HIDE_THRESHOLD = 32;

export function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const headerRef = useRef<HTMLElement>(null);
  const [topHidden, setTopHidden] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);

    const onScroll = () => {
      setTopHidden(window.scrollY > SCROLL_HIDE_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mq.removeEventListener("change", syncMotion);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.offsetHeight}px`,
      );
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--site-header-height");
    };
  }, []);

  const topTransition = reduceMotion
    ? ""
    : "transition-[grid-template-rows,opacity,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-navy-950">
      <div
        className={`grid overflow-hidden bg-ivory-50 ${topTransition} ${
          topHidden
            ? "pointer-events-none grid-rows-[0fr] border-b-0 opacity-0"
            : "grid-rows-[1fr] border-b border-navy-800 opacity-100"
        }`}
        aria-hidden={topHidden}
      >
        <div className="min-h-0 overflow-hidden">
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
