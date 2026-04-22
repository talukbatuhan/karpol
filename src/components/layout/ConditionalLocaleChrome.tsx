"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PremiumNav from "@/components/layout/PremiumNav";
import {
  useThemePreference,
  type EffectiveTheme,
} from "@/components/layout/ThemePreferenceProvider";

const hideBreadcrumbs = (pathname: string) =>
  pathname === "/" ||
  pathname === "/about" ||
  pathname === "/contact" ||
  pathname === "/catalog" ||
  pathname === "/products" ||
  pathname.startsWith("/products/");

/**
 * Pages that use the ivory & navy light theme by default.
 * The homepage stays on the dark theme to match the cinematic hero.
 */
export const isLightThemePath = (pathname: string) =>
  pathname !== "/" &&
  (pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/catalog" ||
    pathname.startsWith("/catalog/") ||
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname === "/industries" ||
    pathname.startsWith("/industries/"));

export function autoThemeFor(pathname: string): EffectiveTheme {
  return isLightThemePath(pathname) ? "light" : "dark";
}

export function ConditionalHeader() {
  const pathname = usePathname();
  // Anasayfanın kendi cinematic navbar'ı var (PremiumHero içinde).
  // Tema tercihi ne olursa olsun PremiumNav buraya basılmaz; iki nav
  // üst üste binmesin diye anasayfada hiçbir koşulda render edilmiyor.
  if (pathname === "/") return null;
  return <PremiumNav />;
}

export function ConditionalBreadcrumbs() {
  const pathname = usePathname();
  if (hideBreadcrumbs(pathname)) return null;
  return <Breadcrumbs />;
}

export function ConditionalFooter({ footer }: { footer: ReactNode }) {
  const pathname = usePathname();
  const { effective } = useThemePreference({
    autoEffective: autoThemeFor(pathname),
  });
  return (
    <div className="ft-theme-scope" data-theme={effective}>
      {footer}
    </div>
  );
}
