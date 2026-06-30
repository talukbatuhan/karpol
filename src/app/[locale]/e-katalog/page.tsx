import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { PageShell } from "@/components/organisms/PageShell";
import { PageHeader } from "@/components/organisms/PageHeader";
import { EcatalogCard } from "@/components/molecules/EcatalogCard";
import { Reveal } from "@/components/motion/Reveal";
import { getPublishedEcatalogCards } from "@/services/ecatalogs";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildStaticPageMetadata(locale, "catalog");
}

export default async function CatalogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tPage = await getTranslations("catalogPage");
  const catalogs = await getPublishedEcatalogCards(locale);

  return (
    <PageShell>
      <PageHeader title={tPage("title")} subtitle={tPage("subtitle")} />

      <Reveal className="col-span-12 md:col-span-8">
        <p className="font-sans text-base leading-relaxed text-navy-800/90 md:text-lg">
          {tPage("intro")}
        </p>
      </Reveal>

      {catalogs.length === 0 ? (
        <div className="col-span-12 border border-navy-800/20 bg-ivory-100 px-8 py-16 text-center">
          <p className="font-display text-xl font-bold text-navy-950">
            {tPage("emptyTitle")}
          </p>
          <p className="mt-3 text-sm text-navy-800/75">{tPage("emptyDescription")}</p>
        </div>
      ) : (
        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {catalogs.map((catalog) => (
            <Reveal key={catalog.slug} className="min-w-0">
              <EcatalogCard
                slug={catalog.slug}
                title={catalog.title}
                description={catalog.description}
                year={catalog.year || undefined}
                coverImage={catalog.coverImage}
                readLabel={tPage("readCatalog")}
              />
            </Reveal>
          ))}
        </div>
      )}
    </PageShell>
  );
}
