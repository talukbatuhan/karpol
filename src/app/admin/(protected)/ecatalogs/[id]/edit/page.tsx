import { notFound } from "next/navigation";
import {
  getEcatalogAdmin,
  listPublishedProductSlugsAdmin,
} from "@/actions/ecatalog-actions";
import { EcatalogForm } from "@/components/admin/EcatalogForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditEcatalogPage({ params }: Props) {
  const { id } = await params;
  const [ecatalog, productSlugs] = await Promise.all([
    getEcatalogAdmin(id),
    listPublishedProductSlugsAdmin(),
  ]);

  if (!ecatalog) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">E-katalog düzenle</h1>
      <EcatalogForm ecatalog={ecatalog} productSlugs={productSlugs} />
    </div>
  );
}
