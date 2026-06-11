import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/organisms/PageShell";
import { PageHeader } from "@/components/organisms/PageHeader";
import { SpecRow } from "@/components/molecules/SpecRow";
import { Reveal } from "@/components/motion/Reveal";
import {
  getPublishedProductBySlug,
  getPublishedProductSlugs,
} from "@/lib/products";

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
      path: `/products/${slug}`,
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
    path: `/products/${slug}`,
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
      <PageHeader title={product.title} subtitle={product.description} />

      <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 md:self-start">
        <div className="border border-navy-800 bg-navy-950 p-6 text-ivory-50">
          <p className="font-mono text-xs uppercase tracking-widest text-gold-300">
            Spec
          </p>
          <dl className="mt-4">
            {product.specs.map((spec) => (
              <SpecRow key={spec.label} label={spec.label} value={spec.value} />
            ))}
          </dl>
          {product.toolHref ? (
            <Link
              href={product.toolHref}
              className="mt-6 block border border-gold-500 px-5 py-3 text-center font-mono text-xs uppercase tracking-widest text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950"
            >
              {tPage("openTool")} →
            </Link>
          ) : null}
        </div>
      </aside>

      <Reveal className="col-span-12 space-y-6 md:col-span-8">
        <p className="font-sans text-lg leading-relaxed text-navy-800">
          {product.body}
        </p>
        <Link
          href="/products"
          className="inline-block font-mono text-xs uppercase tracking-widest text-navy-800 underline decoration-gold-500 underline-offset-4"
        >
          ← {tPage("title")}
        </Link>
      </Reveal>
    </PageShell>
  );
}
