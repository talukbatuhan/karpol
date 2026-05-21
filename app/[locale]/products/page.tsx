import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageShell } from "@/components/organisms/PageShell";
import { PageHeader } from "@/components/organisms/PageHeader";
import { ProductCard } from "@/components/molecules/ProductCard";
import { products } from "@/lib/products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productsPage" });
  return { title: `${t("title")} | Karpol` };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tPage = await getTranslations("productsPage");
  const tProducts = await getTranslations("products");

  return (
    <PageShell>
      <PageHeader title={tPage("title")} subtitle={tPage("subtitle")} />

      {products.map((product) => (
        <div key={product.slug} className="col-span-12 md:col-span-4">
          <ProductCard
            slug={product.slug}
            title={tProducts(`${product.messageKey}.title`)}
            description={tProducts(`${product.messageKey}.description`)}
            viewLabel={tPage("viewDetail")}
          />
        </div>
      ))}
    </PageShell>
  );
}
