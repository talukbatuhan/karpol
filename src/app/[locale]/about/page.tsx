import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PremiumAbout from "@/components/about/PremiumAbout";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PremiumAbout />;
}
