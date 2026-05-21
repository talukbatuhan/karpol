import { redirect } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

/** Eski URL → yeni araç slug */
export default async function VibrationDampersRedirect({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/tools/kaucuk-titresim-takozlari", locale });
}
