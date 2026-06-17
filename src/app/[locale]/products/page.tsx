import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { PageShell } from "@/components/organisms/PageShell";
import { PageHeader } from "@/components/organisms/PageHeader";
import { ProductsCatalog } from "@/components/organisms/ProductsCatalog";
import { getPublishedProducts } from "@/services/products";
import { getPublicCategoryTabs } from "@/services/categories";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildStaticPageMetadata(locale, "products");
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const tPage = await getTranslations("productsPage");
  const [items, categoryTabs] = await Promise.all([
    getPublishedProducts(locale),
    getPublicCategoryTabs(locale),
  ]);

  const validSlugs = new Set(categoryTabs.map((tab) => tab.slug));
  const initialCategory =
    category && validSlugs.has(category) ? category : "all";

  return (
    <PageShell>
      <PageHeader title={tPage("title")} subtitle={tPage("subtitle")} />

      <Suspense fallback={null}>
        <ProductsCatalog
          products={items}
          categoryTabs={categoryTabs}
          initialCategory={initialCategory}
          labels={{
            viewDetail: tPage("viewDetail"),
            allCategories: tPage("allCategories"),
            emptyTitle: tPage("emptyTitle"),
            emptyDescription: tPage("emptyDescription"),
            emptyFilterTitle: tPage("emptyFilterTitle"),
            emptyFilterDescription: tPage("emptyFilterDescription"),
          }}
        />
      </Suspense>
    </PageShell>
  );
}
