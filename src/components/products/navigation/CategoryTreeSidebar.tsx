"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PublicCategoryTreeNode } from "@/lib/product-category-utils";

function TreeNodeRow({
  node,
  depth,
  currentSlug,
}: {
  node: PublicCategoryTreeNode;
  depth: number;
  currentSlug: string;
}) {
  const [open, setOpen] = useState(true);
  const hasKids = node.children.length > 0;
  const isActive = node.hrefCategorySlug === currentSlug;

  return (
    <li style={{ listStyle: "none" }}>
      <div
        style={{
          paddingLeft: depth * 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
          minHeight: 36,
        }}
      >
        {hasKids ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            style={{
              border: "none",
              background: "transparent",
              padding: 4,
              cursor: "pointer",
              color: "rgba(100, 116, 139, 0.9)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {open ? <ChevronDown size={16} strokeWidth={1.75} /> : <ChevronRight size={16} strokeWidth={1.75} />}
          </button>
        ) : (
          <span style={{ width: 24, flexShrink: 0 }} aria-hidden />
        )}
        <Link
          href={{
            pathname: "/products/[category]",
            params: { category: node.hrefCategorySlug },
          }}
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.82rem",
            fontWeight: isActive ? 600 : 400,
            color: isActive ? "rgba(15, 23, 41, 0.98)" : "rgba(71, 85, 105, 0.92)",
            textDecoration: "none",
            flex: 1,
            lineHeight: 1.35,
          }}
        >
          {node.label}
        </Link>
      </div>
      {hasKids && open && (
        <ul style={{ margin: 0, padding: 0 }}>
          {node.children.map((c) => (
            <TreeNodeRow key={c.id} node={c} depth={depth + 1} currentSlug={currentSlug} />
          ))}
        </ul>
      )}
    </li>
  );
}

type CategoryTreeSidebarProps = {
  tree: PublicCategoryTreeNode[];
  currentCategorySlug: string;
  heading: string;
};

export default function CategoryTreeSidebar({
  tree,
  currentCategorySlug,
  heading,
}: CategoryTreeSidebarProps) {
  if (tree.length === 0) return null;

  return (
    <div className="pp-tree-sidebar" style={{ marginBottom: "1.75rem" }}>
      <h3 className="pp-filter-label" style={{ marginBottom: "0.85rem" }}>
        {heading}
      </h3>
      <ul style={{ margin: 0, padding: 0 }}>
        {tree.map((n) => (
          <TreeNodeRow key={n.id} node={n} depth={0} currentSlug={currentCategorySlug} />
        ))}
      </ul>
    </div>
  );
}
