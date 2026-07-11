import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata } from "@/lib/seo/metadata";

import { PageShell } from "@/components/organisms/PageShell";

import { ProductDetailView } from "@/components/organisms/ProductDetailView";

import {

  getPublishedProductBySlug,

  getPublishedProductSlugs,

} from "@/services/products";



export const revalidate = 60;



type Props = {

  params: Promise<{ locale: string; slug: string }>;

};



export async function generateStaticParams() {

  const slugs = await getPublishedProductSlugs();

  return slugs.flatMap((slug) =>

    ["tr", "en"].map((locale) => ({ locale, slug })),

  );

}



export const dynamicParams = true;



export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { locale, slug } = await params;

  const product = await getPublishedProductBySlug(slug, locale);

  if (!product) {

    return buildPageMetadata({

      locale,

      path: `/urunler/${slug}`,

      title: "Karpol Poliüretan",

      description: "",

      noIndex: true,

    });

  }



  const titleSuffix = locale === "tr" ? "Karpol Poliüretan" : "Karpol Polyurethane";

  const description =

    product.description ||

    (locale === "tr"

      ? `${product.title} — endüstriyel poliüretan ve kauçuk çözümleri.`

      : `${product.title} — industrial polyurethane and rubber solutions.`);



  return buildPageMetadata({

    locale,

    path: `/urunler/${slug}`,

    title: `${product.title} | ${titleSuffix}`,

    description,

    image: product.assets?.image,

  });

}



export default async function ProductDetailPage({ params }: Props) {

  const { locale, slug } = await params;

  setRequestLocale(locale);



  const product = await getPublishedProductBySlug(slug, locale);

  if (!product) notFound();



  const tPage = await getTranslations("productsPage");



  return (

    <PageShell>

      <ProductDetailView

        product={product}

        labels={{

          productImageTitle: tPage("productImageTitle"),
          specTitle: tPage("specTitle"),
          technicalDrawingTitle: tPage("technicalDrawingTitle"),
          technicalTableTitle: tPage("technicalTableTitle"),
          technicalTablePage: tPage("technicalTablePage"),
          technicalTablePrevious: tPage("technicalTablePrevious"),
          technicalTableNext: tPage("technicalTableNext"),
          openTool: tPage("openTool"),

          downloadCad: tPage("downloadCad"),

          downloadPdf: tPage("downloadPdf"),

          backToProducts: tPage("backToProducts"),
        }}

      />

    </PageShell>

  );

}

