import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PremiumProductsHub from "@/components/products/PremiumProductsHub";
import {
  getProductCategories,
  getProductCountsByCategory,
} from "@/lib/data/public-data";
import { getLocalizedSlug } from "@/lib/i18n-helpers";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ProductsHub");
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [counts, categoriesRes] = await Promise.all([
    getProductCountsByCategory(),
    getProductCategories(),
  ]);

  const categoryLocaleSlugs: Record<string, string> = {};
  for (const cat of categoriesRes.data) {
    categoryLocaleSlugs[cat.slug] = getLocalizedSlug(cat.slugs, locale, cat.slug);
  }

  return (
    <PremiumProductsHub
      counts={counts}
      categoryLocaleSlugs={categoryLocaleSlugs}
    />
  );
}
