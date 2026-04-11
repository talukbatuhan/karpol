import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hasan Kara — Dijital Kartvizit | KARPOL',
  description:
    'Karpol Poliüretan — Hasan Kara ile telefon, WhatsApp, e-posta ve kurumsal bağlantılar.',
  alternates: {
    canonical: '/hasankara',
  },
}

export default function HasankaraLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
