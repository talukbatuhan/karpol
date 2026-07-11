import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Metadata } from "next";

import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { PageShell } from "@/components/organisms/PageShell";

import { PageHeader } from "@/components/organisms/PageHeader";

import { Reveal } from "@/components/motion/Reveal";



type Props = { params: Promise<{ locale: string }> };



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildStaticPageMetadata(locale, "about");
}



export default async function AboutPage({ params }: Props) {

  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("about");



  const sections = [

    { title: t("technicalTitle"), text: t("technicalText") },

    { title: t("solutionsTitle"), text: t("solutionsText") },

  ];



  const whyItems = [

    { title: t("why1Title"), text: t("why1Text") },

    { title: t("why2Title"), text: t("why2Text") },

    { title: t("why3Title"), text: t("why3Text") },

  ];



  return (

    <PageShell>

      <PageHeader title={t("title")} subtitle={t("subtitle")} />



      <Reveal className="col-span-12 md:col-span-8 lg:col-span-7">

        <p className="font-sans text-lg leading-relaxed text-navy-800">

          {t("intro")}

        </p>

      </Reveal>



      {sections.map((section) => (

        <Reveal key={section.title} className="col-span-12 md:col-span-8 lg:col-span-7">

          <h2 className="font-display text-2xl font-bold tracking-tight text-navy-950 md:text-[1.65rem]">

            {section.title}

          </h2>

          <p className="mt-4 font-sans text-base leading-relaxed text-navy-800/90">

            {section.text}

          </p>

        </Reveal>

      ))}



      <Reveal className="col-span-12 pt-2">

        <h2 className="border-l-4 border-gold-500 pl-5 font-display text-2xl font-bold tracking-tight text-navy-950 md:text-3xl">

          {t("whyTitle")}

        </h2>

      </Reveal>



      {whyItems.map((item) => (

        <Reveal

          key={item.title}

          className="col-span-12 border border-navy-800 bg-ivory-100 p-8 md:col-span-4"

        >

          <h3 className="font-display text-xl font-bold text-navy-950">

            {item.title}

          </h3>

          <p className="mt-3 font-sans text-sm leading-relaxed text-navy-800/85">

            {item.text}

          </p>

        </Reveal>

      ))}

    </PageShell>

  );

}


