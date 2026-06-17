import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EcardView } from "@/components/ecard/EcardView";
import { getEcardProfile, getEcardSlugs } from "@/lib/ecard/cards";
import { getEcardPublicPath } from "@/lib/ecard/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/seo/site";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getEcardSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = getEcardProfile(slug);
  const publicPath = getEcardPublicPath(slug);

  if (!profile) {
    return buildPageMetadata({
      locale: routing.defaultLocale,
      path: publicPath,
      title: "Karpol Poliüretan",
      description: "",
      noIndex: true,
      localeFree: true,
    });
  }

  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "ecard",
  });

  return buildPageMetadata({
    locale: routing.defaultLocale,
    path: publicPath,
    title: t("metaTitle", { name: profile.name, company: profile.company }),
    description: t("metaDescription", {
      name: profile.name,
      title: profile.title,
      company: profile.company,
    }),
    image: profile.photoSrc,
    localeFree: true,
  });
}

export default async function EcardPage({ params }: Props) {
  const { slug } = await params;
  setRequestLocale(routing.defaultLocale);

  const profile = getEcardProfile(slug);
  if (!profile) notFound();

  const t = await getTranslations("ecard");
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${getEcardPublicPath(slug)}`;

  return (
    <EcardView
      profile={profile}
      pageUrl={pageUrl}
      labels={{
        whatsapp: t("whatsapp"),
        phone: t("phone"),
        email: t("email"),
        website: t("website"),
        catalog: t("catalog"),
        directions: t("directions"),
        vcard: t("vcard"),
        qrLabel: t("qrLabel"),
        qrHint: t("qrHint"),
        socialTitle: t("socialTitle"),
      }}
    />
  );
}
