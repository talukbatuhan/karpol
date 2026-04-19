"use client";

import { usePathname } from "@/i18n/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PremiumNav from "@/components/layout/PremiumNav";
import AksanFooter from "@/components/layout/AksanFooter";
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
  const { preference } = useThemePreference({
    autoEffective: autoThemeFor(pathname),
  });
  // On the homepage, only render PremiumNav when the user explicitly
  // forced light/dark mode; otherwise the cinematic hero owns its own nav.
  if (pathname === "/" && preference === "auto") return null;
  return <PremiumNav />;
}

export function ConditionalBreadcrumbs() {
  const pathname = usePathname();
  if (hideBreadcrumbs(pathname)) return null;
  return <Breadcrumbs />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const { effective } = useThemePreference({
    autoEffective: autoThemeFor(pathname),
  });
  return <AksanFooter theme={effective} />;
}
