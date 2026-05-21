import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karpol Poliüretan",
  description: "Ürün değil, çözüm üretiyoruz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ViewTransitions>{children}</ViewTransitions>;
}
