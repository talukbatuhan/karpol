import Link from "next/link";
import { listEcatalogsAdmin } from "@/actions/ecatalog-actions";
import { EcatalogTable } from "@/components/admin/EcatalogTable";

export default async function AdminEcatalogsPage() {
  const ecatalogs = await listEcatalogsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">E-Kataloglar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dijital kataloglar, sayfa görselleri ve ürün linkleri.
          </p>
        </div>
        <Link
          href="/admin/ecatalogs/new"
          className="border border-gold-500 bg-gold-500 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-navy-950"
        >
          Yeni e-katalog
        </Link>
      </div>

      {ecatalogs.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz e-katalog yok.</p>
      ) : (
        <EcatalogTable ecatalogs={ecatalogs} />
      )}
    </div>
  );
}
