import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { PageShell } from "@/components/organisms/PageShell";
import { PageHeader } from "@/components/organisms/PageHeader";
import { SpecRow } from "@/components/molecules/SpecRow";
import { Reveal } from "@/components/motion/Reveal";
import { getProduct, productSlugs } from "@/lib/products";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return productSlugs.flatMap((slug) =>
    ["tr", "en"].map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Karpol" };
  const t = await getTranslations({
    locale,
    namespace: `products.${product.messageKey}`,
  });
  return { title: `${t("title")} | Karpol` };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProduct(slug);
  if (!product) notFound();

  const t = await getTranslations(`products.${product.messageKey}`);
  const tPage = await getTranslations("productsPage");

  const specs = [
    { label: tPage("specMaterial"), value: t("specMaterial") },
    { label: tPage("specUse"), value: t("specUse") },
    { label: tPage("specNorm"), value: t("specNorm") },
  ];

  return (
    <PageShell>
      <PageHeader title={t("title")} subtitle={t("description")} />

      <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 md:self-start">
        <div className="border border-navy-800 bg-navy-950 p-6 text-ivory-50">
          <p className="font-mono text-xs uppercase tracking-widest text-gold-300">
            Spec
          </p>
          <dl className="mt-4">
            {specs.map((spec) => (
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
        <p className="font-sans text-lg leading-relaxed text-navy-800">{t("body")}</p>
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
