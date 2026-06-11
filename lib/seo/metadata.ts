import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { DEFAULT_OG_IMAGE, getSiteUrl } from "@/lib/seo/site";

export type BuildPageMetadataInput = {
  locale: string;
  /** Locale öneki olmadan yol: `/`, `/about`, `/tools/makara` */
  path: string;
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
};

function localePath(locale: string, path: string): string {
  if (path === "/" || path === "") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

function toOpenGraphLocale(locale: string): string {
  return locale === "tr" ? "tr_TR" : "en_US";
}

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const path = input.path === "" ? "/" : input.path;
  const canonical = `${siteUrl}${localePath(input.locale, path)}`;

  const imagePath = input.image ?? DEFAULT_OG_IMAGE;
  const imageUrl = imagePath.startsWith("http")
    ? imagePath
    : `${siteUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${siteUrl}${localePath(loc, path)}`;
  }
  languages["x-default"] = `${siteUrl}${localePath(routing.defaultLocale, path)}`;

  const siteName =
    input.locale === "tr" ? "Karpol Poliüretan" : "Karpol Polyurethane";

  const alternateLocale = routing.locales
    .filter((loc) => loc !== input.locale)
    .map(toOpenGraphLocale);

  const metadata: Metadata = {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName,
      locale: toOpenGraphLocale(input.locale),
      alternateLocale,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [imageUrl],
    },
  };

  if (input.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}
