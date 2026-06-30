import { listPublishedProductSlugsAdmin } from "@/actions/ecatalog-actions";
import { EcatalogForm } from "@/components/admin/EcatalogForm";

export default async function NewEcatalogPage() {
  const productSlugs = await listPublishedProductSlugsAdmin();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Yeni e-katalog</h1>
      <EcatalogForm productSlugs={productSlugs} />
    </div>
  );
}
