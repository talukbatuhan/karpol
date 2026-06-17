import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono, Geist } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { DEFAULT_OG_IMAGE, getSiteUrl } from "@/lib/seo/site";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Karpol Poliüretan",
    template: "%s",
  },
  description:
    "Ürün değil, çözüm üretiyoruz; tecrübemizi satıyoruz.",
  openGraph: {
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Karpol Poliüretan" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={cn("h-full", syne.variable, dmSans.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-ivory-50 text-navy-950">
        <ViewTransitions>{children}</ViewTransitions>
      </body>
    </html>
  );
}
