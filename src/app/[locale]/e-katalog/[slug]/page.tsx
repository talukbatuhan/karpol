import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageShell } from "@/components/organisms/PageShell";
import { EcatalogBookReader } from "@/components/ecatalog/EcatalogBookReader";
import { getPublishedEcatalogBySlug } from "@/services/ecatalogs";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const catalog = await getPublishedEcatalogBySlug(slug, locale);
  if (!catalog) return { title: "E-Katalog" };
  return {
    title: `${catalog.title} | E-Katalog`,
    description: catalog.description,
  };
}

export default async function EcatalogReaderPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const catalog = await getPublishedEcatalogBySlug(slug, locale);
  if (!catalog) notFound();

  const tPage = await getTranslations("catalogPage");

  return (
    <PageShell>
      <EcatalogBookReader
        catalog={catalog}
        labels={{
          back: tPage("backToCatalogs"),
          previous: tPage("previousPage"),
          next: tPage("nextPage"),
          spreadOf: tPage("pageOf"),
          goToProduct: tPage("goToProduct"),
          empty: tPage("readerEmpty"),
        }}
      />
    </PageShell>
  );
}
