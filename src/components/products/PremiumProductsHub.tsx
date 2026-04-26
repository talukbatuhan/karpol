"use client";
import {
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { productCategories } from "@/lib/config";
import type { ProductCategory } from "@/types/database";
import { getLocalizedField } from "@/lib/i18n-helpers";

type HubProps = {
  counts: Record<string, number>;
  categoryLocaleSlugs?: Record<string, string>;
  categories?: ProductCategory[];
};

export default function PremiumProductsHub({
  counts,
  categoryLocaleSlugs = {},
  categories = [],
}: HubProps) {
  const locale = useLocale();
  const t = useTranslations("ProductsHub.premium");
  const bannerStyles = [
    "bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.35),transparent_45%),linear-gradient(155deg,#1e293b,#0f172a)]",
    "bg-[radial-gradient(circle_at_85%_20%,rgba(249,115,22,0.25),transparent_40%),linear-gradient(135deg,#111827,#1f2937)]",
    "bg-[radial-gradient(circle_at_15%_25%,rgba(59,130,246,0.22),transparent_38%),linear-gradient(135deg,#0f172a,#1e293b)]",
    "bg-[radial-gradient(circle_at_75%_80%,rgba(16,185,129,0.22),transparent_38%),linear-gradient(145deg,#111827,#172554)]",
  ];
  const displayCategories =
    categories.length > 0
      ? categories
      : productCategories.map((cat) => ({
          slug: cat.slug,
          name: { tr: cat.name, en: cat.name },
          description: { tr: "", en: "" },
          icon: cat.icon,
          image_url: undefined,
        }));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 dark:bg-[#0a0f1c]">
      <section id="categories" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-orange-300">{t("categories.eyebrow")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {displayCategories.map((cat, index) => {
            const localeSlug = categoryLocaleSlugs[cat.slug] ?? cat.slug;
            return (
              <Link
                key={cat.slug}
                href={{
                  pathname: "/products/[category]",
                  params: { category: localeSlug },
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-slate-800/70 p-5 transition duration-500 hover:scale-[1.01] hover:border-orange-500/70"
              >
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={getLocalizedField(cat.name, locale) || cat.slug}
                    className="absolute inset-0 z-10 h-full w-full object-cover"
                  />
                ) : (
                  <div className={`absolute inset-0 z-10 ${bannerStyles[index % bannerStyles.length]}`} aria-hidden />
                )}
                <div className="absolute inset-0 z-10 bg-slate-950/45" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-slate-950/90 to-transparent" aria-hidden />
                <div className="relative z-10">
                  <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-orange-500/25 bg-orange-500/10 px-2 text-base text-orange-200">
                    {"icon" in cat ? cat.icon : "⚙️"}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-100">
                    {getLocalizedField(cat.name, locale) || cat.slug}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                    {getLocalizedField(cat.description, locale)}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-300">
                    {t("common.browse")}
                    <ArrowRight className="h-4 w-4 transition duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                  <p className="mt-3 text-xs text-slate-300/80">
                    {t("categories.activeProducts", { count: counts[cat.slug] ?? 0 })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
