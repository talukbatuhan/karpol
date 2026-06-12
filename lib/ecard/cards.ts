export type EcardSocialLinks = {
  youtube?: string;
  instagram?: string;
  linkedin?: string;
};

export type EcardAddress = {
  line1: string;
  line2: string;
  mapsUrl: string;
};

export type EcardProfile = {
  slug: string;
  name: string;
  title: string;
  company: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  website: string;
  catalogPath: string;
  photoSrc?: string;
  photoAlt: string;
  address: EcardAddress;
  social: EcardSocialLinks;
};

const MAPS_QUERY =
  "Bozburun+Mahallesi,+7151+Sokak+No:13/1,+Merkezefendi,+Denizli,+Türkiye";

const KARPOL_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

export const ECARD_PROFILES: EcardProfile[] = [
  {
    slug: "hasankara",
    name: "Hasan Kara",
    title: "Yönetim",
    company: "Karpol Poliüretan",
    phoneDisplay: "+90 542 665 25 60",
    phoneHref: "tel:+905426652560",
    whatsappHref: "https://wa.me/905426652560",
    email: "hasankara2022@gmail.com",
    website: "https://www.karpol.net",
    catalogPath: "/e-katalog",
    photoSrc: "/kart/hasankara.jpg",
    photoAlt: "Hasan Kara — Karpol Poliüretan",
    address: {
      line1: "Bozburun Mahallesi, 7151 Sokak No:13/1",
      line2: "Merkezefendi / Denizli, Türkiye",
      mapsUrl: KARPOL_MAPS_URL,
    },
    social: {
      youtube: "https://www.youtube.com/@karpolpoliuretan",
    },
  },
];

export function getEcardProfile(slug: string): EcardProfile | undefined {
  return ECARD_PROFILES.find((profile) => profile.slug === slug);
}

export function getEcardSlugs(): string[] {
  return ECARD_PROFILES.map((profile) => profile.slug);
}
