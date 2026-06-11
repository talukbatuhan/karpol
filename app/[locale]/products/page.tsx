import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { PageShell } from "@/components/organisms/PageShell";
import { PageHeader } from "@/components/organisms/PageHeader";
import { ProductCard } from "@/components/molecules/ProductCard";
import { getPublishedProducts } from "@/lib/products";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildStaticPageMetadata(locale, "products");
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tPage = await getTranslations("productsPage");
  const items = await getPublishedProducts(locale);

  return (
    <PageShell>
      <PageHeader title={tPage("title")} subtitle={tPage("subtitle")} />

      {items.map((product) => (
        <div key={product.slug} className="col-span-12 md:col-span-4">
          <ProductCard
            slug={product.slug}
            title={product.title}
            description={product.description}
            viewLabel={tPage("viewDetail")}
          />
        </div>
      ))}
    </PageShell>
  );
}
