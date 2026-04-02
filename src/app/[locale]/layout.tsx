import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "tr" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.instagram,
      siteConfig.social.youtube,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "sales",
      areaServed: "World",
    },
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Header />
      <Breadcrumbs />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
