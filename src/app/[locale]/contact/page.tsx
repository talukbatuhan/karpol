import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PremiumContact from "@/components/contact/PremiumContact";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("Navigation");
  const t = await getTranslations("ContactPage");
  return {
    title: tNav("contact"),
    description: t("heroSubtitle"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PremiumContact />;
}
