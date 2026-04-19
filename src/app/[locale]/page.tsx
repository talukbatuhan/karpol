import { setRequestLocale } from "next-intl/server";
import AksanHero from "@/components/home/AksanHero";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AksanHero />;
}
