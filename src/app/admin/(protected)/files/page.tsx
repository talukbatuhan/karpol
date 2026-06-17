import { AdminFilesSection } from "@/components/admin/AdminFilesSection";
import { listStorageFiles } from "@/actions/storage-actions";

export default async function AdminFilesPage() {
  const [images, files] = await Promise.all([
    listStorageFiles("product-images"),
    listStorageFiles("product-files"),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy-950">Dosyalar</h1>
        <p className="mt-2 text-sm text-navy-800/70">
          Görseller ve CAD/PDF dosyalarını yükleyin. Ürün formundan doğrudan da
          yükleyebilirsiniz.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-gold-600">
          product-images
        </h2>
        <AdminFilesSection bucket="product-images" items={images} />
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-gold-600">
          product-files
        </h2>
        <AdminFilesSection bucket="product-files" items={files} />
      </section>
    </div>
  );
}
