"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useHeaderMinimal } from "@/components/layout/HeaderModeContext";
import { NavLink } from "@/components/molecules/NavLink";
import { LocaleSwitch } from "@/components/molecules/LocaleSwitch";
import { HeaderContact } from "@/components/molecules/HeaderContact";
import { HeaderCatalogLink } from "@/components/molecules/HeaderCatalogLink";
import { HeaderSocialLinks } from "@/components/molecules/HeaderSocialLinks";
import {
  HeaderMenuButton,
  HeaderMobileNav,
} from "@/components/molecules/HeaderMobileNav";
import { Rule } from "@/components/atoms/Rule";
import { setSiteHeaderHeight } from "@/lib/site-header-height";

/** Sayfa tepesindeyken üst band her zaman açık */
const SCROLL_TOP_SHOW = 8;
/** Aşağı kayınca gizlemeye başlama eşiği */
const SCROLL_HIDE_AFTER = 48;
/** Küçük titreşimleri yok say (px) */
const SCROLL_DELTA_MIN = 5;

type HeaderProps = {
  minimal?: boolean;
};

export function Header({ minimal: minimalProp }: HeaderProps = {}) {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();
  const minimalFromContext = useHeaderMinimal();
  const isMinimal = minimalProp ?? minimalFromContext;

  const topBandRef = useRef<HTMLDivElement>(null);
  const navInnerRef = useRef<HTMLDivElement>(null);
  const navHeightRef = useRef(0);
  const topHeightRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const isTopCollapsedRef = useRef(false);

  const [topHidden, setTopHidden] = useState(isMinimal);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const isTopCollapsed = isMinimal || topHidden;
  isTopCollapsedRef.current = isTopCollapsed;

  const applySiteHeaderHeight = useCallback((collapsed: boolean) => {
    const nav = navHeightRef.current;
    const top = topHeightRef.current;
    setSiteHeaderHeight(collapsed ? nav : nav + top);
  }, []);

  const measureBandHeights = useCallback(() => {
    const navEl = navInnerRef.current;
    const topEl = topBandRef.current;
    if (!navEl) return;

    navHeightRef.current = navEl.offsetHeight;

    if (topEl) {
      const measured = topEl.offsetHeight;
      if (measured > 0) topHeightRef.current = measured;
    }

    applySiteHeaderHeight(isTopCollapsedRef.current);
  }, [applySiteHeaderHeight]);

  const setTopHiddenSafe = useCallback((hidden: boolean) => {
    setTopHidden((prev) => {
      if (prev === hidden) return prev;
      isTopCollapsedRef.current = isMinimal || hidden;
      applySiteHeaderHeight(isTopCollapsedRef.current);
      return hidden;
    });
  }, [isMinimal, applySiteHeaderHeight]);

  const syncTopFromScroll = useCallback(() => {
    if (isMinimal) return;

    const y = window.scrollY;
    const delta = y - lastScrollYRef.current;
    lastScrollYRef.current = y;

    if (y <= SCROLL_TOP_SHOW) {
      setTopHiddenSafe(false);
      return;
    }

    if (delta < -SCROLL_DELTA_MIN) {
      setTopHiddenSafe(false);
      return;
    }

    if (delta > SCROLL_DELTA_MIN && y > SCROLL_HIDE_AFTER) {
      setTopHiddenSafe(true);
    }
  }, [isMinimal, setTopHiddenSafe]);

  useEffect(() => {
    setMenuOpen(false);
    lastScrollYRef.current = window.scrollY;

    if (isMinimal) {
      setTopHidden(true);
      isTopCollapsedRef.current = true;
      requestAnimationFrame(measureBandHeights);
      return;
    }

    const hidden = window.scrollY > SCROLL_HIDE_AFTER;
    setTopHidden(hidden);
    isTopCollapsedRef.current = hidden;
    requestAnimationFrame(measureBandHeights);
  }, [pathname, isMinimal, measureBandHeights]);

  useEffect(() => {
    if (isTopCollapsed || isMinimal) return;
    const frame = requestAnimationFrame(measureBandHeights);
    return () => cancelAnimationFrame(frame);
  }, [isTopCollapsed, isMinimal, measureBandHeights]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);
    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    if (isMinimal) return;

    syncTopFromScroll();
    window.addEventListener("scroll", syncTopFromScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncTopFromScroll);
  }, [isMinimal, syncTopFromScroll]);

  useEffect(() => {
    measureBandHeights();

    const navEl = navInnerRef.current;
    if (!navEl) return;

    const observer = new ResizeObserver(() => {
      measureBandHeights();
    });
    observer.observe(navEl);

    window.addEventListener("resize", measureBandHeights);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureBandHeights);
    };
  }, [measureBandHeights]);

  const topTransition = reduceMotion
    ? ""
    : "transition-[grid-template-rows,opacity,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";

  return (
    <header className="sticky top-0 z-50 shrink-0 bg-navy-950">
      <div
        className={`grid overflow-hidden bg-ivory-50 ${topTransition} ${
          isTopCollapsed
            ? "pointer-events-none grid-rows-[0fr] border-b-0 opacity-0"
            : "grid-rows-[1fr] border-b border-navy-800 opacity-100"
        }`}
        aria-hidden={isTopCollapsed}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            ref={topBandRef}
            className="mx-auto flex w-full max-w-[1440px] flex-wrap items-start justify-between gap-x-4 gap-y-3 py-2.5 pl-6 pr-6 md:gap-x-6 md:pr-10"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
              <Link
                href="/"
                className="hidden shrink-0 items-center sm:flex"
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
            <HeaderContact className="text-right [&_p]:justify-end" />
          </div>
        </div>
      </div>

      <div
        ref={navInnerRef}
        className="mx-auto grid w-full max-w-[1440px] grid-cols-12 items-center gap-3 py-3 pl-6 pr-6 md:gap-4 md:pr-10"
      >
        <div className="col-span-12 flex items-center justify-between gap-3 lg:hidden">
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
              className="h-8 w-auto object-contain"
            />
          </Link>
          <HeaderMenuButton
            open={menuOpen}
            onToggle={() => setMenuOpen((value) => !value)}
          />
        </div>

        <nav
          className="col-span-12 hidden items-center justify-center gap-6 lg:col-span-9 lg:flex lg:justify-start lg:gap-8"
          aria-label={t("menuTitle")}
        >
          <NavLink href="/" label={t("home")} />
          <NavLink href="/about" label={t("about")} />
          <NavLink href="/products" label={t("products")} />
          <NavLink href="/tools" label={t("tools")} />
          <NavLink href="/contact" label={t("contact")} />
        </nav>

        <div className="col-span-12 hidden items-center justify-end gap-3 lg:col-span-3 lg:flex">
          <HeaderCatalogLink />
          <HeaderSocialLinks />
          <LocaleSwitch />
        </div>

        <Rule className="col-span-12 w-full" />
      </div>

      <HeaderMobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
