import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getProductCategoryByLocalizedSlug,
  getProductCategories,
} from "@/lib/data/public-data";
import { getLocalizedField, getLocalizedSlug } from "@/lib/i18n-helpers";
import { productCategories } from "@/lib/config";
import { createClient } from "@/lib/supabase-server";
import type { Product } from "@/types/database";
import PremiumProductCategory, {
  type LocalizedProduct,
} from "@/components/products/PremiumProductCategory";

type CategoryPageProps = {
  params: Promise<{ category: string; locale: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ProductsCategory");
  const tHub = await getTranslations("ProductsHub");

  const { data: categoryData } = await getProductCategoryByLocalizedSlug(
    category,
    locale,
  );
  const isKnownCanonical = productCategories.some((c) => c.slug === category);

  const fallbackKey = categoryData?.slug ?? (isKnownCanonical ? category : null);

  const name = categoryData
    ? getLocalizedField(categoryData.name, locale)
    : fallbackKey
      ? tHub(`categoryNames.${fallbackKey}`)
      : null;
  const description = categoryData
    ? getLocalizedField(categoryData.description, locale)
    : fallbackKey
      ? tHub(`categoryDescriptions.${fallbackKey}`)
      : null;

  if (!name) {
    return { title: t("error.title") };
  }

  // Locale-aware alternates for hreflang + locale switcher
  const buildLocaleHref = (target: string) => {
    const catSlug = categoryData
      ? getLocalizedSlug(categoryData.slugs, target, categoryData.slug)
      : category;
    const productsSegment = target === "tr" ? "urunler" : "products";
    return `/${target}/${productsSegment}/${catSlug}`;
  };

  const trHref = buildLocaleHref("tr");
  const enHref = buildLocaleHref("en");

  return {
    title: `${name} | ${t("metadata.titleSuffix")}`,
    description:
      description ?? `Explore our high-performance ${name} range.`,
    alternates: {
      canonical: locale === "tr" ? trHref : enHref,
      languages: {
        tr: trHref,
        en: enHref,
        "x-default": enHref,
      },
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, locale } = await params;
  setRequestLocale(locale);

  const { data: categoryData } = await getProductCategoryByLocalizedSlug(
    category,
    locale,
  );

  const isKnownCanonical = productCategories.some((c) => c.slug === category);
  if (!categoryData && !isKnownCanonical) {
    notFound();
  }

  const tHub = await getTranslations("ProductsHub");

  const canonicalKey = categoryData?.slug ?? category;

  const categoryName = categoryData
    ? getLocalizedField(categoryData.name, locale) ||
      tHub(`categoryNames.${canonicalKey}`)
    : tHub(`categoryNames.${canonicalKey}`);

  const categoryDescription = categoryData
    ? getLocalizedField(categoryData.description, locale) ||
      tHub(`categoryDescriptions.${canonicalKey}`)
    : tHub(`categoryDescriptions.${canonicalKey}`);

  const localeCategorySlug = categoryData
    ? getLocalizedSlug(categoryData.slugs, locale, categoryData.slug)
    : category;

  let products: LocalizedProduct[] = [];
  if (categoryData) {
    const supabase = await createClient();
    const { data: productsRaw } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryData.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    products = ((productsRaw ?? []) as Product[]).map((p) => ({
      slug: getLocalizedSlug(p.slugs, locale, p.slug),
      sku: p.sku,
      name: getLocalizedField(p.name, locale),
      description:
        getLocalizedField(p.short_description, locale) ||
        getLocalizedField(p.description, locale),
      material: p.material,
      hardness:
        p.hardness && p.hardness_unit
          ? `${p.hardness} ${p.hardness_unit}`
          : p.hardness ?? undefined,
      image: p.images && p.images.length > 0 ? p.images[0] : undefined,
    }));
  } else {
    // Eski fallback: kategori DB'de yok ama config'te var → boş liste
    const { data: allCats } = await getProductCategories();
    if (allCats.length === 0) {
      products = [];
    }
  }

  return (
    <PremiumProductCategory
      categorySlug={localeCategorySlug}
      categoryName={categoryName}
      categoryDescription={categoryDescription}
      products={products}
    />
  );
}
