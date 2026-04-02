import { redirect } from "next/navigation";

export default function CatalogPage() {
  // Enforce i18n route so navbar links resolve correctly.
  redirect("/en/catalog");
}
