"use client";

import type { CategoryRow } from "@/lib/types/category";

type CategoryTabsProps = {
  categories: CategoryRow[];
  active: string | "all";
  onChange: (value: string | "all") => void;
};

export function CategoryTabs({
  categories,
  active,
  onChange,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
          active === "all"
            ? "border-gold-500 bg-gold-500 text-navy-950"
            : "border-navy-800/30 text-navy-800 hover:border-navy-800"
        }`}
      >
        Tümü
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={`rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
            active === c.id
              ? "border-gold-500 bg-gold-500 text-navy-950"
              : "border-navy-800/30 text-navy-800 hover:border-navy-800"
          }`}
        >
          {c.name_tr}
        </button>
      ))}
    </div>
  );
}
