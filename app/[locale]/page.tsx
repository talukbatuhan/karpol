import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { TypographicManifest } from "@/components/organisms/TypographicManifest";
import { ScrollLinkedTape } from "@/components/organisms/ScrollLinkedTape";
import { MaterialIndex } from "@/components/organisms/MaterialIndex";
import { SpecStrip } from "@/components/organisms/SpecStrip";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildStaticPageMetadata(locale, "home");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
      <div className="grid grid-cols-12 gap-6 md:gap-8">
        <section className="col-span-12 min-h-[70vh] py-16 md:py-24">
          <TypographicManifest />
        </section>

        <section className="col-span-12">
          <ScrollLinkedTape />
        </section>

        <section className="col-span-12 py-12 md:py-16">
          <MaterialIndex />
        </section>

        <section className="col-span-12 pb-20">
          <SpecStrip />
        </section>
      </div>
    </div>
  );
}
