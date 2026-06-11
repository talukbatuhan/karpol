import { FileUploadPanel } from "@/components/admin/FileUploadPanel";
import { listStorageFiles } from "@/lib/actions/storage-actions";
import { getPublicStorageUrl } from "@/lib/storage-url";

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
          Yüklenen yolları ürün formundaki metadata.assets alanına yapıştırın.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-gold-600">
          product-images
        </h2>
        <FileUploadPanel bucket="product-images" />
        <FileList bucket="product-images" items={images} />
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-gold-600">
          product-files
        </h2>
        <FileUploadPanel bucket="product-files" />
        <FileList bucket="product-files" items={files} />
      </section>
    </div>
  );
}

function FileList({
  bucket,
  items,
}: {
  bucket: "product-images" | "product-files";
  items: { path: string; name: string }[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-navy-800/50">Henüz dosya yok.</p>;
  }

  return (
    <ul className="divide-y divide-navy-800/10 border border-navy-800/20 text-sm">
      {items.map((f) => (
        <li key={f.path} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
          <code className="font-mono text-xs">{f.path}</code>
          <a
            href={getPublicStorageUrl(bucket, f.path)}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-widest text-gold-600 underline"
          >
            Aç
          </a>
        </li>
      ))}
    </ul>
  );
}
