"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { NavLink } from "@/components/molecules/NavLink";
import { HeaderCatalogLink } from "@/components/molecules/HeaderCatalogLink";
import { HeaderSocialLinks } from "@/components/molecules/HeaderSocialLinks";
import { LocaleSwitch } from "@/components/molecules/LocaleSwitch";
import { HeaderContact } from "@/components/molecules/HeaderContact";
import { Rule } from "@/components/atoms/Rule";

const NAV_ITEMS = [
  { href: "/" as const, key: "home" },
  { href: "/about" as const, key: "about" },
  { href: "/products" as const, key: "products" },
  { href: "/tools" as const, key: "tools" },
  { href: "/contact" as const, key: "contact" },
] as const;

type HeaderMobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function HeaderMobileNav({ open, onClose }: HeaderMobileNavProps) {
  const t = useTranslations("nav");

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-navy-950/75"
        aria-label={t("menuClose")}
        onClick={onClose}
      />

      <aside
        id="header-mobile-nav"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[min(100%,320px)] flex-col border-l border-navy-800 bg-navy-950 shadow-[-8px_0_24px_rgba(6,14,26,0.35)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="header-mobile-nav-title"
      >
        <div className="flex items-center justify-between border-b border-navy-800 px-5 py-4">
          <p
            id="header-mobile-nav-title"
            className="font-mono text-[10px] uppercase tracking-widest text-gold-500"
          >
            {t("menuTitle")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center border border-gold-500/50 font-mono text-lg leading-none text-ivory-100 transition-colors hover:border-gold-500 hover:text-gold-300"
            aria-label={t("menuClose")}
          >
            ×
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-4">
          {NAV_ITEMS.map((item) => (
            <div key={item.href} onClick={onClose} role="presentation">
              <NavLink href={item.href} label={t(item.key)} />
            </div>
          ))}
        </nav>

        <div className="shrink-0 space-y-4 border-t border-navy-800 px-5 py-4">
          <div onClick={onClose} role="presentation">
            <HeaderCatalogLink />
          </div>
          <HeaderContact className="text-left [&_p]:justify-start" />
          <div className="flex items-center justify-between gap-3">
            <HeaderSocialLinks />
            <LocaleSwitch />
          </div>
        </div>

        <Rule className="w-full opacity-40" />
      </aside>
    </>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  const bar =
    "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]";

  return (
    <span className="relative block h-4 w-5" aria-hidden>
      <span
        className={`${bar} top-0 ${open ? "top-[7px] rotate-45" : ""}`}
      />
      <span
        className={`${bar} top-[7px] ${open ? "opacity-0" : "opacity-100"}`}
      />
      <span
        className={`${bar} top-[14px] ${open ? "top-[7px] -rotate-45" : ""}`}
      />
    </span>
  );
}

export function HeaderMenuButton({
  open,
  onToggle,
  variant = "dark",
}: {
  open: boolean;
  onToggle: () => void;
  variant?: "light" | "dark";
}) {
  const t = useTranslations("nav");

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="header-mobile-nav"
      aria-label={open ? t("menuClose") : t("menuOpen")}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center border transition-colors lg:hidden ${
        variant === "light"
          ? "border-navy-800/35 text-navy-950 hover:border-navy-950 hover:text-navy-800"
          : "border-gold-500/50 text-ivory-100 hover:border-gold-500 hover:text-gold-300"
      }`}
    >
      <HamburgerIcon open={open} />
    </button>
  );
}
