"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { HeaderSocialLinks } from "@/components/molecules/HeaderSocialLinks";

const navLinks = [
  { href: "/" as const, key: "home" },
  { href: "/about" as const, key: "about" },
  { href: "/products" as const, key: "products" },
  { href: "/e-katalog" as const, key: "ecatalog" },
  { href: "/tools" as const, key: "tools" },
  { href: "/contact" as const, key: "contact" },
] as const;

export function Footer() {
  const tNav = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const tFooter = useTranslations("footer");
  const tContact = useTranslations("contact");
  const pathname = usePathname();

  if (pathname.includes("/tools/")) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-navy-800 bg-ivory-50 text-navy-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-6 md:px-10">
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] md:items-stretch md:gap-6">
          <div className="shrink-0 md:max-w-[280px]">
            <Link href="/" className="inline-block">
              <img
                src="/karpol-logo-nav.png"
                alt={tBrand("name")}
                width={2025}
                height={510}
                className="h-11 w-auto object-contain drop-shadow-md md:h-12"
              />
            </Link>
            <p className="mt-1.5 font-sans text-sm leading-snug text-navy-800/85 md:text-[0.9375rem]">
              {tFooter("tagline")}
            </p>
          </div>

          <div className="flex h-full flex-col items-start md:items-center md:justify-self-center">
            <div className="mt-auto flex flex-col items-start md:items-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold-500">
                {tFooter("navTitle")}
              </p>
              <ul className="mt-1 space-y-px md:text-center">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-sans text-xs leading-tight text-navy-800 transition-colors hover:text-gold-500"
                    >
                      {tNav(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex h-full shrink-0 flex-col md:justify-self-end md:text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold-500">
              {tFooter("contactTitle")}
            </p>
            <ul className="mt-2 space-y-1 font-sans text-sm text-navy-800">
              <li>
                <a
                  href={`mailto:${tContact("email")}`}
                  className="transition-colors hover:text-gold-500"
                >
                  {tContact("email")}
                </a>
              </li>
              <li>
                <a
                  href="tel:+905496652560"
                  className="font-mono transition-colors hover:text-gold-500"
                >
                  {tContact("phone")}
                </a>
              </li>
              <li>
                <span className="block">{tContact("addressLine1")}</span>
                <span className="block text-navy-800/75">
                  {tContact("addressLine2")}
                </span>
              </li>
            </ul>
            <div className="mt-auto flex pt-3 md:justify-end">
              <HeaderSocialLinks variant="light" />
            </div>
          </div>
        </div>

        <p className="mt-5 border-t border-navy-800/30 pt-4 font-mono text-[10px] uppercase tracking-widest text-navy-800/55">
          © {new Date().getFullYear()} {tBrand("name")}. {tFooter("rights")}
        </p>
      </div>
    </footer>
  );
}
