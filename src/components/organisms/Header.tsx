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

const SCROLL_TOP_SHOW = 16;
const SCROLL_HIDE_AFTER = 64;
const SCROLL_DOWN_TO_HIDE = 56;
const SCROLL_UP_TO_SHOW = 28;
const TOGGLE_COOLDOWN_MS = 320;
const MOBILE_MAX_WIDTH = 1023;

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

type HeaderProps = {
  minimal?: boolean;
};

type ScrollCtrl = {
  lastY: number;
  accum: number;
  hidden: boolean;
  lockedUntil: number;
  ticking: boolean;
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
  const isTopCollapsedRef = useRef(false);
  const scrollCtrl = useRef<ScrollCtrl>({
    lastY: 0,
    accum: 0,
    hidden: false,
    lockedUntil: 0,
    ticking: false,
  });

  const [topHidden, setTopHidden] = useState(isMinimal);
  const [topBandMaxHeight, setTopBandMaxHeight] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isTopCollapsed = isMinimal || topHidden;
  isTopCollapsedRef.current = isTopCollapsed;
  const collapseTopBand = isTopCollapsed && !isMobile;

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
      const measured = topEl.scrollHeight;
      if (measured > 0) {
        topHeightRef.current = measured;
        setTopBandMaxHeight(measured);
      }
    }

    applySiteHeaderHeight(isTopCollapsedRef.current);
  }, [applySiteHeaderHeight]);

  const commitTopHidden = useCallback(
    (hidden: boolean, syncHeightImmediately: boolean) => {
      setTopHidden((prev) => {
        if (prev === hidden) return prev;
        isTopCollapsedRef.current = isMinimal || hidden;
        scrollCtrl.current.hidden = hidden;
        scrollCtrl.current.accum = 0;
        scrollCtrl.current.lockedUntil =
          performance.now() + TOGGLE_COOLDOWN_MS;
        if (syncHeightImmediately) {
          applySiteHeaderHeight(isTopCollapsedRef.current);
        }
        return hidden;
      });
    },
    [isMinimal, applySiteHeaderHeight],
  );

  const syncTopFromScroll = useCallback(() => {
    if (isMinimal || isMobileViewport()) return;

    if (scrollCtrl.current.ticking) return;
    scrollCtrl.current.ticking = true;

    requestAnimationFrame(() => {
      scrollCtrl.current.ticking = false;

      const now = performance.now();
      if (now < scrollCtrl.current.lockedUntil) return;

      const y = window.scrollY;
      const delta = y - scrollCtrl.current.lastY;
      scrollCtrl.current.lastY = y;

      if (y <= SCROLL_TOP_SHOW) {
        if (scrollCtrl.current.hidden) {
          commitTopHidden(false, reduceMotion);
        }
        scrollCtrl.current.accum = 0;
        return;
      }

      if (
        Math.abs(delta) < 1 ||
        (delta > 0 && scrollCtrl.current.accum < 0) ||
        (delta < 0 && scrollCtrl.current.accum > 0)
      ) {
        scrollCtrl.current.accum = delta;
      } else {
        scrollCtrl.current.accum += delta;
      }

      if (
        !scrollCtrl.current.hidden &&
        y > SCROLL_HIDE_AFTER &&
        scrollCtrl.current.accum >= SCROLL_DOWN_TO_HIDE
      ) {
        commitTopHidden(true, reduceMotion);
        return;
      }

      if (
        scrollCtrl.current.hidden &&
        scrollCtrl.current.accum <= -SCROLL_UP_TO_SHOW
      ) {
        commitTopHidden(false, reduceMotion);
      }
    });
  }, [isMinimal, commitTopHidden, reduceMotion]);

  const handleTopBandTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "max-height") return;
      applySiteHeaderHeight(isTopCollapsedRef.current);
    },
    [applySiteHeaderHeight],
  );

  useEffect(() => {
    setMenuOpen(false);

    const y = window.scrollY;
    scrollCtrl.current.lastY = y;
    scrollCtrl.current.accum = 0;
    scrollCtrl.current.lockedUntil = 0;

    if (isMinimal) {
      scrollCtrl.current.hidden = true;
      setTopHidden(true);
      isTopCollapsedRef.current = true;
      requestAnimationFrame(measureBandHeights);
      return;
    }

    const mobile = isMobileViewport();
    const hidden = mobile ? false : window.scrollY > SCROLL_HIDE_AFTER;
    scrollCtrl.current.hidden = hidden;
    setTopHidden(hidden);
    isTopCollapsedRef.current = hidden;
    requestAnimationFrame(measureBandHeights);
  }, [pathname, isMinimal, measureBandHeights]);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const syncMobile = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (mobile && scrollCtrl.current.hidden) {
        commitTopHidden(false, true);
      }
    };
    syncMobile();
    mq.addEventListener("change", syncMobile);
    return () => mq.removeEventListener("change", syncMobile);
  }, [commitTopHidden]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);
    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    if (isMinimal) return;

    scrollCtrl.current.lastY = window.scrollY;
    window.addEventListener("scroll", syncTopFromScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncTopFromScroll);
  }, [isMinimal, syncTopFromScroll]);

  useEffect(() => {
    measureBandHeights();

    const topEl = topBandRef.current;
    const navEl = navInnerRef.current;
    if (!topEl && !navEl) return;

    let resizeFrame = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measureBandHeights);
    };

    const observer = new ResizeObserver(scheduleMeasure);
    if (topEl) observer.observe(topEl);
    if (navEl) observer.observe(navEl);

    window.addEventListener("resize", scheduleMeasure);
    return () => {
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [measureBandHeights]);

  const topTransition = reduceMotion
    ? ""
    : "transition-[max-height,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";

  return (
    <header className="sticky top-0 z-50 shrink-0 bg-ivory-50 lg:bg-navy-950">
      <div
        className={`overflow-hidden bg-ivory-50 ${topTransition} ${
          collapseTopBand
            ? "pointer-events-none border-b-0"
            : "border-b border-navy-800"
        }`}
        style={{
          maxHeight: collapseTopBand ? 0 : topBandMaxHeight || undefined,
        }}
        onTransitionEnd={handleTopBandTransitionEnd}
        aria-hidden={collapseTopBand}
      >
        <div
          ref={topBandRef}
          className="mx-auto flex w-full max-w-[1440px] items-start justify-between gap-3 py-2.5 pl-6 pr-6 sm:gap-x-4 md:pr-10"
        >
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3 md:gap-4">
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
                className="h-8 w-auto bg-transparent object-contain drop-shadow-md transition-[filter] duration-200 hover:brightness-110 sm:h-9 md:h-10"
              />
            </Link>
            <p className="min-w-0 font-sans text-xs leading-snug text-navy-950/85 sm:flex-1 sm:text-sm md:text-[0.9375rem]">
              {tBrand("headerSlogan")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <HeaderContact className="hidden text-right sm:block sm:[&_p]:justify-end" />
            <HeaderMenuButton
              variant="light"
              open={menuOpen}
              onToggle={() => setMenuOpen((value) => !value)}
            />
          </div>
        </div>
      </div>

      <div
        ref={navInnerRef}
        className="mx-auto hidden w-full max-w-[1440px] grid-cols-12 items-center gap-3 py-3 pl-6 pr-6 md:gap-4 md:pr-10 lg:grid"
      >
        <nav
          className="col-span-9 flex items-center justify-start gap-8"
          aria-label={t("menuTitle")}
        >
          <NavLink href="/" label={t("home")} />
          <NavLink href="/about" label={t("about")} />
          <NavLink href="/products" label={t("products")} />
          <NavLink href="/tools" label={t("tools")} />
          <NavLink href="/contact" label={t("contact")} />
        </nav>

        <div className="col-span-3 flex items-center justify-end gap-3">
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
