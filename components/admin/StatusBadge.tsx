import type { ProductStatus } from "@/lib/types/product";

const styles: Record<ProductStatus, string> = {
  draft: "bg-navy-800/10 text-navy-800",
  published: "bg-gold-500/20 text-navy-950",
};

const labels: Record<ProductStatus, string> = {
  draft: "Taslak",
  published: "Yayında",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
