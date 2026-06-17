import type { ProductStatus } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const labels: Record<ProductStatus, string> = {
  draft: "Taslak",
  published: "Yayında",
};

export interface StatusBadgeProps {
  status: ProductStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant={status === "published" ? "default" : "secondary"}
      className={cn(
        "font-mono text-[10px] uppercase tracking-widest",
        status === "published" && "bg-gold-500/20 text-navy-950",
      )}
    >
      {labels[status]}
    </Badge>
  );
}
