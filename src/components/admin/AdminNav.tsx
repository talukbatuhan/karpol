"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Ürünler", exact: false },
  { href: "/admin/categories", label: "Kategoriler", exact: false },
  { href: "/admin/ecatalogs", label: "E-Kataloglar", exact: false },
  { href: "/admin/files", label: "Dosyalar", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {nav.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
              active
                ? "bg-navy-800 text-gold-300"
                : "text-ivory-50/80 hover:bg-navy-800 hover:text-gold-300"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
