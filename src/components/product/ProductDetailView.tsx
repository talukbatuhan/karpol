"use client";
"use no memo";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  PenTool,
  Ruler,
  Search,
  Settings2,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import ProductVisualsWrapper, {
  type GalleryItem,
} from "./ProductVisualsWrapper";
import RFQModalWrapper from "./RFQModalWrapper";
import type { Product3DSource } from "./Product3DViewer";
import type {
  ProductSpecification,
  SizeTable,
} from "@/types/database";
import { getLocalizedField } from "@/lib/i18n-helpers";

export type ProductDetailViewProps = {
  locale: string;
  productTitle: string;
  shortDesc: string;
  longDesc: string;
  sku?: string;
  category: {
    name: string;
    slug: string;
  };
  meta: {
    material?: string;
    hardness?: string;
    hardnessUnit?: string;
    color?: string;
  };
  modules: {
    specifications: boolean;
    size_table: boolean;
    technical_drawing: boolean;
    model_3d: boolean;
    gallery: boolean;
    datasheet: boolean;
    applications: boolean;
  };
  gallery: GalleryItem[];
  model3d: Product3DSource | null;
  specifications: ProductSpecification[];
  sizeTable: SizeTable;
  applications: string[];
  highlights: string[];
  compatibleMachines: string[];
  technicalDrawings: { url: string; title: string }[];
  datasheets: { url: string; title: string }[];
  related: {
    id: string;
    name: string;
    slug: string;
    image?: string;
  }[];
};

export default function ProductDetailView({
  locale,
  productTitle,
  shortDesc,
  longDesc,
  sku,
  category,
  meta,
  modules,
  gallery,
  model3d,
  specifications,
  sizeTable,
  applications,
  highlights,
  compatibleMachines,
  technicalDrawings,
  datasheets,
  related,
}: ProductDetailViewProps) {
  const t = useTranslations("ProductDetail");

  const SIZE_PAGE_SIZE = 10;
  const [sizeSearch, setSizeSearch] = useState("");
  const [sizePage, setSizePage] = useState(1);

  const filteredSizeRows = useMemo(() => {
    const rows = sizeTable.rows;
    const q = sizeSearch.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      sizeTable.columns.some((col) =>
        (row[col.key] ?? "").toString().toLowerCase().includes(q),
      ),
    );
  }, [sizeTable.rows, sizeTable.columns, sizeSearch]);

  const sizePageCount = Math.max(
    1,
    Math.ceil(filteredSizeRows.length / SIZE_PAGE_SIZE),
  );

  useEffect(() => {
    if (sizePage > sizePageCount) setSizePage(1);
  }, [sizePage, sizePageCount]);

  const pagedSizeRows = useMemo(() => {
    const start = (sizePage - 1) * SIZE_PAGE_SIZE;
    return filteredSizeRows.slice(start, start + SIZE_PAGE_SIZE);
  }, [filteredSizeRows, sizePage]);

  return (
    <main className="pd-root">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
        .pd-root { font-family: 'DM Sans', sans-serif; color: rgba(15, 23, 41, 0.92); background: #FFFFFF; }
      `}</style>

      <style jsx>{`
        .pd-root { min-height: 100vh; padding-bottom: 120px; }

        .pd-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 28px;
        }

        .pd-crumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 110px 0 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(100, 116, 139, 0.8);
        }
        .pd-crumbs a {
          color: rgba(71, 85, 105, 0.88);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .pd-crumbs a:hover { color: rgba(15, 23, 41, 0.96); }
        .pd-crumb-current { color: rgba(200, 168, 90, 0.9); }

        .pd-hero { position: relative; overflow: hidden; }
        .pd-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(200, 168, 90, 0.10), transparent 70%),
            radial-gradient(ellipse 50% 30% at 10% 80%, rgba(200, 168, 90, 0.06), transparent 70%);
          pointer-events: none;
        }
        .pd-hero-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200, 168, 90, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 168, 90, 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.5;
          pointer-events: none;
        }
        .pd-hero-inner {
          position: relative;
          padding: 24px 0 80px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 56px;
        }
        .pd-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(200, 168, 90, 0.88);
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .pd-eyebrow-line {
          display: inline-block;
          width: 32px; height: 1px;
          background: rgba(200, 168, 90, 0.6);
        }
        .pd-eyebrow strong {
          font-weight: 500;
          color: rgba(200, 168, 90, 0.95);
        }
        .pd-eyebrow-sku {
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(200, 168, 90, 0.08);
          color: rgba(200, 168, 90, 0.95);
          font-family: ui-monospace, monospace;
          letter-spacing: 0.1em;
        }
        .pd-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(40px, 5.5vw, 72px);
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: rgba(15, 23, 41, 0.98);
          margin: 0 0 24px;
        }
        .pd-lead {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(71, 85, 105, 0.92);
          max-width: 580px;
          margin: 0 0 32px;
        }
        .pd-meta-row {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-bottom: 36px;
        }
        .pd-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border: 1px solid rgba(200, 168, 90, 0.26);
          border-radius: 100px;
          background: rgba(244, 241, 234, 0.45);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(15, 23, 41, 0.88);
        }
        .pd-meta-pill span:first-child { color: rgba(200, 168, 90, 0.75); }

        .pd-section { padding: 80px 0; position: relative; }
        .pd-section-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(200, 168, 90, 0.22), transparent);
        }
        .pd-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .pd-section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(200, 168, 90, 0.82);
          margin-bottom: 14px;
        }
        .pd-section-eyebrow-line {
          width: 22px; height: 1px;
          background: rgba(200, 168, 90, 0.55);
        }
        .pd-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(32px, 3.6vw, 48px);
          line-height: 1.1;
          letter-spacing: -0.005em;
          color: rgba(15, 23, 41, 0.98);
          margin: 0;
        }
        .pd-section-title em {
          font-style: italic;
          color: rgba(200, 168, 90, 0.95);
        }
        .pd-section-sub {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(71, 85, 105, 0.85);
          max-width: 540px;
          margin: 14px 0 0;
        }

        .pd-overview-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.5;
          color: rgba(15, 23, 41, 0.92);
          max-width: 980px;
          margin: 0;
        }

        .pd-spec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          border: 1px solid rgba(200, 168, 90, 0.18);
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(244, 241, 234, 0.5), rgba(244, 241, 234, 0.55));
        }
        .pd-spec-cell {
          padding: 26px 28px;
          border-right: 1px solid rgba(200, 168, 90, 0.10);
          border-bottom: 1px solid rgba(200, 168, 90, 0.10);
        }
        .pd-spec-label {
          display: block;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(200, 168, 90, 0.7);
          margin-bottom: 10px;
        }
        .pd-spec-value {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 24px;
          line-height: 1.2;
          color: rgba(15, 23, 41, 0.98);
        }
        .pd-spec-unit {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(200, 168, 90, 0.7);
          margin-left: 6px;
          letter-spacing: 0.05em;
        }
        .pd-spec-test {
          display: block;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(100, 116, 139, 0.7);
          margin-top: 8px;
        }

        .pd-size-wrap {
          border: 1px solid rgba(200, 168, 90, 0.18);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(244, 241, 234, 0.55);
        }
        .pd-size-scroll {
          max-height: 560px;
          overflow-y: auto;
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(200, 168, 90, 0.26) transparent;
        }
        .pd-size-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .pd-size-scroll::-webkit-scrollbar-thumb {
          background: rgba(200, 168, 90, 0.22);
          border-radius: 4px;
        }
        .pd-size-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'DM Sans', sans-serif;
        }
        .pd-size-table th {
          position: sticky;
          top: 0;
          z-index: 2;
          text-align: left;
          padding: 16px 24px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(200, 168, 90, 0.85);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(200, 168, 90, 0.22);
          font-weight: 500;
          box-shadow: 0 1px 0 rgba(15, 23, 41, 0.18);
        }
        .pd-size-table td {
          padding: 16px 24px;
          font-size: 14px;
          color: rgba(15, 23, 41, 0.92);
          border-bottom: 1px solid rgba(200, 168, 90, 0.08);
          font-variant-numeric: tabular-nums;
        }
        .pd-size-table tr:last-child td { border-bottom: none; }
        .pd-size-table tbody tr { transition: background 0.15s ease; }
        .pd-size-table tbody tr:hover { background: rgba(200, 168, 90, 0.06); }
        .pd-size-cell-primary {
          font-family: ui-monospace, monospace;
          color: rgba(200, 168, 90, 0.95);
          letter-spacing: 0.05em;
        }
        .pd-size-empty {
          padding: 48px 24px !important;
          text-align: center;
          color: rgba(100, 116, 139, 0.75);
          font-size: 13px;
          letter-spacing: 0.06em;
        }

        .pd-size-search {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border: 1px solid rgba(200, 168, 90, 0.22);
          border-radius: 999px;
          background: rgba(244, 241, 234, 0.75);
          transition: border-color 0.2s ease, background 0.2s ease;
          min-width: 220px;
          color: rgba(200, 168, 90, 0.78);
        }
        .pd-size-search:focus-within {
          border-color: rgba(200, 168, 90, 0.55);
          background: rgba(255, 255, 255, 0.96);
        }
        .pd-size-search input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(15, 23, 41, 0.92);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 0.02em;
          min-width: 0;
        }
        .pd-size-search input::placeholder {
          color: rgba(100, 116, 139, 0.65);
        }
        .pd-size-search-clear {
          background: transparent;
          border: none;
          color: rgba(200, 168, 90, 0.65);
          cursor: pointer;
          padding: 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .pd-size-search-clear:hover {
          color: rgba(15, 23, 41, 0.95);
          background: rgba(200, 168, 90, 0.10);
        }

        .pd-size-pager {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 18px;
          border-top: 1px solid rgba(200, 168, 90, 0.14);
          background: rgba(244, 241, 234, 0.6);
          flex-wrap: wrap;
        }
        .pd-size-pager-info {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(100, 116, 139, 0.82);
          font-family: 'DM Sans', sans-serif;
        }
        .pd-size-pager-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border: 1px solid rgba(200, 168, 90, 0.26);
          border-radius: 999px;
          color: rgba(15, 23, 41, 0.88);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pd-size-pager-btn:hover:not(:disabled) {
          border-color: rgba(200, 168, 90, 0.6);
          background: rgba(200, 168, 90, 0.08);
        }
        .pd-size-pager-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        @media (max-width: 720px) {
          .pd-size-search { min-width: 0; width: 100%; }
          .pd-size-pager { padding: 12px; }
          .pd-size-pager-info { order: -1; flex-basis: 100%; text-align: center; }
        }

        .pd-app-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }
        .pd-app-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 22px 24px;
          border: 1px solid rgba(200, 168, 90, 0.18);
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(244, 241, 234, 0.6), rgba(244, 241, 234, 0.65));
          transition: all 0.2s ease;
        }
        .pd-app-card:hover {
          border-color: rgba(200, 168, 90, 0.35);
          background: linear-gradient(180deg, rgba(15, 23, 41, 0.92), rgba(244, 241, 234, 0.75));
        }
        .pd-app-icon {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: rgba(200, 168, 90, 0.10);
          color: rgba(200, 168, 90, 0.95);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pd-app-text {
          font-size: 14px;
          line-height: 1.5;
          color: rgba(15, 23, 41, 0.92);
          padding-top: 6px;
        }

        .pd-highlight-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 36px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .pd-highlight-item {
          display: flex; gap: 14px; align-items: flex-start;
        }
        .pd-highlight-icon {
          color: rgba(200, 168, 90, 0.95);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .pd-highlight-text {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(15, 23, 41, 0.88);
        }

        .pd-machine-tags {
          display: flex; flex-wrap: wrap; gap: 10px;
        }
        .pd-machine-tag {
          padding: 10px 18px;
          border-radius: 100px;
          background: rgba(200, 168, 90, 0.08);
          border: 1px solid rgba(200, 168, 90, 0.22);
          color: rgba(15, 23, 41, 0.92);
          font-size: 13px;
          letter-spacing: 0.04em;
        }

        .pd-doc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
        }
        .pd-doc-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 20px 22px;
          border: 1px solid rgba(200, 168, 90, 0.18);
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(244, 241, 234, 0.6), rgba(244, 241, 234, 0.65));
          color: rgba(15, 23, 41, 0.94);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .pd-doc-card:hover {
          border-color: rgba(200, 168, 90, 0.45);
          transform: translateX(2px);
        }
        .pd-doc-meta {
          display: flex; align-items: center; gap: 14px;
          flex: 1; min-width: 0;
        }
        .pd-doc-icon {
          width: 42px; height: 42px;
          border-radius: 10px;
          background: rgba(200, 168, 90, 0.10);
          color: rgba(200, 168, 90, 0.95);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pd-doc-title {
          font-size: 14px;
          color: rgba(15, 23, 41, 0.92);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pd-doc-action {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(200, 168, 90, 0.88);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .pd-cta-section {
          margin-top: 40px;
          padding: 64px;
          border-radius: 24px;
          background:
            radial-gradient(ellipse 60% 80% at 70% 20%, rgba(200, 168, 90, 0.12), transparent 70%),
            linear-gradient(180deg, rgba(15, 23, 41, 0.95), rgba(255, 255, 255, 0.96));
          border: 1px solid rgba(200, 168, 90, 0.22);
          position: relative;
          overflow: hidden;
        }
        .pd-cta-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200, 168, 90, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 168, 90, 0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.5;
          pointer-events: none;
        }
        .pd-cta-inner {
          position: relative;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .pd-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(28px, 3.2vw, 42px);
          line-height: 1.1;
          color: rgba(15, 23, 41, 0.98);
          margin: 0 0 16px;
        }
        .pd-cta-text {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(71, 85, 105, 0.92);
          margin: 0;
        }
        .pd-cta-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
        }
        .pd-cta-btn-primary,
        .pd-cta-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 26px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .pd-cta-btn-primary {
          background: #C8A85A;
          color: #0F1729;
          border: 1px solid #C8A85A;
        }
        .pd-cta-btn-primary:hover { background: #B09347; border-color: #B09347; }
        .pd-cta-btn-secondary {
          background: transparent;
          color: rgba(15, 23, 41, 0.88);
          border: 1px solid rgba(200, 168, 90, 0.35);
        }
        .pd-cta-btn-secondary:hover {
          border-color: rgba(200, 168, 90, 0.75);
          background: rgba(15, 23, 41, 0.04);
        }

        .pd-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
        }
        .pd-related-card {
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(200, 168, 90, 0.18);
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(244, 241, 234, 0.6), rgba(244, 241, 234, 0.65));
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .pd-related-card:hover {
          border-color: rgba(200, 168, 90, 0.5);
          transform: translateY(-4px);
        }
        .pd-related-img {
          position: relative;
          aspect-ratio: 4 / 3;
          background: rgba(15, 23, 41, 0.18);
        }
        .pd-related-img-empty {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(100, 116, 139, 0.55);
        }
        .pd-related-body { padding: 22px 22px 24px; }
        .pd-related-cat {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(200, 168, 90, 0.75);
          margin-bottom: 10px;
        }
        .pd-related-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 22px;
          line-height: 1.2;
          color: rgba(15, 23, 41, 0.96);
          margin: 0 0 14px;
        }
        .pd-related-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(200, 168, 90, 0.88);
        }

        @media (max-width: 1024px) {
          .pd-hero-inner { grid-template-columns: 1fr; gap: 32px; }
          .pd-cta-inner { grid-template-columns: 1fr; gap: 28px; }
          .pd-cta-actions { align-items: stretch; }
          .pd-spec-cell { border-right: none; }
          .pd-highlight-list { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .pd-container { padding: 0 18px; }
          .pd-section { padding: 56px 0; }
          .pd-cta-section { padding: 36px 24px; border-radius: 20px; }
          .pd-crumbs { padding-top: 96px; flex-wrap: wrap; }
        }
      `}</style>

      <section className="pd-hero">
        <div className="pd-hero-bg" aria-hidden />
        <div className="pd-hero-grid-bg" aria-hidden />
        <div className="pd-container">
          <nav className="pd-crumbs" aria-label="Breadcrumb">
            <Link href="/products">{t("breadcrumb.products")}</Link>
            <ChevronRight size={11} strokeWidth={1.5} />
            <Link
              href={{
                pathname: "/products/[category]",
                params: { category: category.slug },
              }}
            >
              {category.name}
            </Link>
            <ChevronRight size={11} strokeWidth={1.5} />
            <span className="pd-crumb-current">{productTitle}</span>
          </nav>

          <div className="pd-hero-inner">
            <div>
              <div className="pd-eyebrow">
                <span className="pd-eyebrow-line" />
                <strong>{category.name}</strong>
                {sku && <span className="pd-eyebrow-sku">SKU · {sku}</span>}
              </div>
              <h1 className="pd-title">{productTitle}</h1>
              {shortDesc && <p className="pd-lead">{shortDesc}</p>}

              {(meta.material || meta.hardness || meta.color) && (
                <div className="pd-meta-row">
                  {meta.material && (
                    <div className="pd-meta-pill">
                      <span>{t("spec.material")}</span>
                      {meta.material}
                    </div>
                  )}
                  {meta.hardness && (
                    <div className="pd-meta-pill">
                      <span>{t("spec.hardness")}</span>
                      {meta.hardness} {meta.hardnessUnit}
                    </div>
                  )}
                  {meta.color && (
                    <div className="pd-meta-pill">
                      <span>{t("spec.color")}</span>
                      {meta.color}
                    </div>
                  )}
                </div>
              )}

              <RFQModalWrapper
                productName={productTitle}
                sku={sku}
                contactLink={`/${locale}/contact`}
                buttonText={t("cta_button")}
                contactText={t("contact_engineer")}
              />
            </div>

            <div>
              <ProductVisualsWrapper
                images={gallery}
                productName={productTitle}
                model3d={model3d}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="pd-section-divider" />

      {longDesc && (
        <>
          <section className="pd-section">
            <div className="pd-container">
              <p className="pd-overview-text">{longDesc}</p>
            </div>
          </section>
          <div className="pd-section-divider" />
        </>
      )}

      {modules.specifications && specifications.length > 0 && (
        <>
          <section className="pd-section">
            <div className="pd-container">
              <div className="pd-section-head">
                <div>
                  <div className="pd-section-eyebrow">
                    <span className="pd-section-eyebrow-line" />
                    {t("eyebrow.specs")}
                  </div>
                  <h2 className="pd-section-title">
                    {t("specs")} <em>—</em>
                  </h2>
                </div>
              </div>
              <div className="pd-spec-grid">
                {specifications.map((s, i) => (
                  <div key={`${s.label}-${i}`} className="pd-spec-cell">
                    <span className="pd-spec-label">{s.label}</span>
                    <span className="pd-spec-value">
                      {s.value}
                      {s.unit ? <span className="pd-spec-unit">{s.unit}</span> : null}
                    </span>
                    {s.test_method ? (
                      <span className="pd-spec-test">{s.test_method}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="pd-section-divider" />
        </>
      )}

      {modules.size_table &&
        sizeTable.columns.length > 0 &&
        sizeTable.rows.length > 0 && (
          <>
            <section className="pd-section">
              <div className="pd-container">
                <div className="pd-section-head">
                  <div>
                    <div className="pd-section-eyebrow">
                      <span className="pd-section-eyebrow-line" />
                      <Ruler size={11} strokeWidth={1.6} />
                      {t("eyebrow.sizes")}
                    </div>
                    <h2 className="pd-section-title">
                      {t("sizes")} <em>—</em>
                    </h2>
                  </div>
                  {sizeTable.rows.length > SIZE_PAGE_SIZE && (
                    <div className="pd-size-search">
                      <Search size={14} strokeWidth={1.6} />
                      <input
                        type="search"
                        value={sizeSearch}
                        onChange={(e) => {
                          setSizeSearch(e.target.value);
                          setSizePage(1);
                        }}
                        placeholder={t("size.searchPlaceholder")}
                        aria-label={t("size.searchPlaceholder")}
                      />
                      {sizeSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setSizeSearch("");
                            setSizePage(1);
                          }}
                          aria-label={t("size.clearSearch")}
                          className="pd-size-search-clear"
                        >
                          <X size={13} strokeWidth={1.8} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="pd-size-wrap">
                  <div className="pd-size-scroll">
                    <table className="pd-size-table">
                      <thead>
                        <tr>
                          {sizeTable.columns.map((col) => {
                            const heading =
                              getLocalizedField(col.label, locale) || col.key;
                            return (
                              <th
                                key={col.key}
                                style={{ textAlign: col.align ?? "left" }}
                              >
                                {heading}
                                {col.unit ? ` (${col.unit})` : ""}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {pagedSizeRows.length === 0 ? (
                          <tr>
                            <td
                              colSpan={sizeTable.columns.length}
                              className="pd-size-empty"
                            >
                              {t("size.noResults")}
                            </td>
                          </tr>
                        ) : (
                          pagedSizeRows.map((row, i) => (
                            <tr key={(sizePage - 1) * SIZE_PAGE_SIZE + i}>
                              {sizeTable.columns.map((col, ci) => {
                                const value = row[col.key];
                                const display =
                                  value && value.trim().length > 0 ? value : "—";
                                return (
                                  <td
                                    key={col.key}
                                    className={
                                      ci === 0 ? "pd-size-cell-primary" : undefined
                                    }
                                    style={{ textAlign: col.align ?? "left" }}
                                  >
                                    {display}
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {sizePageCount > 1 && (
                    <div className="pd-size-pager">
                      <button
                        type="button"
                        className="pd-size-pager-btn"
                        onClick={() => setSizePage((p) => Math.max(1, p - 1))}
                        disabled={sizePage === 1}
                        aria-label={t("size.prev")}
                      >
                        <ChevronLeft size={14} strokeWidth={1.8} />
                        <span>{t("size.prev")}</span>
                      </button>
                      <div className="pd-size-pager-info">
                        {t("size.pageInfo", {
                          page: sizePage,
                          total: sizePageCount,
                          rows: filteredSizeRows.length,
                        })}
                      </div>
                      <button
                        type="button"
                        className="pd-size-pager-btn"
                        onClick={() =>
                          setSizePage((p) => Math.min(sizePageCount, p + 1))
                        }
                        disabled={sizePage === sizePageCount}
                        aria-label={t("size.next")}
                      >
                        <span>{t("size.next")}</span>
                        <ChevronRight size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
            <div className="pd-section-divider" />
          </>
        )}

      {modules.applications && applications.length > 0 && (
        <>
          <section className="pd-section">
            <div className="pd-container">
              <div className="pd-section-head">
                <div>
                  <div className="pd-section-eyebrow">
                    <span className="pd-section-eyebrow-line" />
                    <Settings2 size={11} strokeWidth={1.6} />
                    {t("eyebrow.applications")}
                  </div>
                  <h2 className="pd-section-title">
                    {t("applications")} <em>—</em>
                  </h2>
                </div>
              </div>
              <div className="pd-app-grid">
                {applications.map((app, i) => (
                  <div key={i} className="pd-app-card">
                    <div className="pd-app-icon">
                      <Sparkles size={16} strokeWidth={1.6} />
                    </div>
                    <div className="pd-app-text">{app}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="pd-section-divider" />
        </>
      )}

      {highlights.length > 0 && (
        <>
          <section className="pd-section">
            <div className="pd-container">
              <div className="pd-section-head">
                <div>
                  <div className="pd-section-eyebrow">
                    <span className="pd-section-eyebrow-line" />
                    {t("eyebrow.advantages")}
                  </div>
                  <h2 className="pd-section-title">
                    {t("advantages")} <em>—</em>
                  </h2>
                </div>
              </div>
              <ul className="pd-highlight-list">
                {highlights.map((h, i) => (
                  <li key={i} className="pd-highlight-item">
                    <CheckCircle2 size={18} strokeWidth={1.4} className="pd-highlight-icon" />
                    <span className="pd-highlight-text">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <div className="pd-section-divider" />
        </>
      )}

      {compatibleMachines.length > 0 && (
        <>
          <section className="pd-section">
            <div className="pd-container">
              <div className="pd-section-head">
                <div>
                  <div className="pd-section-eyebrow">
                    <span className="pd-section-eyebrow-line" />
                    <Wrench size={11} strokeWidth={1.6} />
                    {t("eyebrow.compatibility")}
                  </div>
                  <h2 className="pd-section-title">
                    {t("compatibility")} <em>—</em>
                  </h2>
                </div>
              </div>
              <div className="pd-machine-tags">
                {compatibleMachines.map((m, i) => (
                  <span key={i} className="pd-machine-tag">{m}</span>
                ))}
              </div>
            </div>
          </section>
          <div className="pd-section-divider" />
        </>
      )}

      {modules.technical_drawing && technicalDrawings.length > 0 && (
        <>
          <section className="pd-section">
            <div className="pd-container">
              <div className="pd-section-head">
                <div>
                  <div className="pd-section-eyebrow">
                    <span className="pd-section-eyebrow-line" />
                    <PenTool size={11} strokeWidth={1.6} />
                    {t("eyebrow.drawings")}
                  </div>
                  <h2 className="pd-section-title">
                    {t("drawings")} <em>—</em>
                  </h2>
                </div>
              </div>
              <div className="pd-doc-grid">
                {technicalDrawings.map((d, i) => (
                  <a
                    key={i}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-doc-card"
                  >
                    <div className="pd-doc-meta">
                      <div className="pd-doc-icon">
                        <PenTool size={18} strokeWidth={1.6} />
                      </div>
                      <span className="pd-doc-title">{d.title}</span>
                    </div>
                    <span className="pd-doc-action">{t("doc.open")}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
          <div className="pd-section-divider" />
        </>
      )}

      {modules.datasheet && datasheets.length > 0 && (
        <>
          <section className="pd-section">
            <div className="pd-container">
              <div className="pd-section-head">
                <div>
                  <div className="pd-section-eyebrow">
                    <span className="pd-section-eyebrow-line" />
                    <FileText size={11} strokeWidth={1.6} />
                    {t("eyebrow.downloads")}
                  </div>
                  <h2 className="pd-section-title">
                    {t("downloads")} <em>—</em>
                  </h2>
                </div>
              </div>
              <div className="pd-doc-grid">
                {datasheets.map((d, i) => (
                  <a
                    key={i}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-doc-card"
                  >
                    <div className="pd-doc-meta">
                      <div className="pd-doc-icon">
                        <FileText size={18} strokeWidth={1.6} />
                      </div>
                      <span className="pd-doc-title">{d.title}</span>
                    </div>
                    <span className="pd-doc-action">
                      <Download size={11} strokeWidth={1.6} />
                      PDF
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
          <div className="pd-section-divider" />
        </>
      )}

      <section className="pd-section">
        <div className="pd-container">
          <div className="pd-cta-section">
            <div className="pd-cta-grid-bg" aria-hidden />
            <div className="pd-cta-inner">
              <div>
                <div className="pd-section-eyebrow">
                  <span className="pd-section-eyebrow-line" />
                  {t("eyebrow.cta")}
                </div>
                <h3 className="pd-cta-title">{t("cta_title")}</h3>
                <p className="pd-cta-text">{t("cta_text")}</p>
              </div>
              <div className="pd-cta-actions">
                <Link href="/contact" className="pd-cta-btn-primary">
                  {t("cta_button")}
                  <ArrowUpRight size={14} strokeWidth={1.6} />
                </Link>
                <Link href="/custom-manufacturing" className="pd-cta-btn-secondary">
                  {t("cta_secondary")}
                  <ArrowUpRight size={13} strokeWidth={1.6} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pd-section">
          <div className="pd-container">
            <div className="pd-section-head">
              <div>
                <div className="pd-section-eyebrow">
                  <span className="pd-section-eyebrow-line" />
                  {t("eyebrow.related")}
                </div>
                <h2 className="pd-section-title">
                  {t("related")} <em>—</em>
                </h2>
                <p className="pd-section-sub">{t("related_sub")}</p>
              </div>
            </div>
            <div className="pd-related-grid">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={{
                    pathname: "/products/[category]/[slug]",
                    params: { category: category.slug, slug: p.slug },
                  }}
                  className="pd-related-card"
                >
                  <div className="pd-related-img">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        style={{ objectFit: "contain", padding: 18 }}
                      />
                    ) : (
                      <div className="pd-related-img-empty">
                        <Sparkles size={28} strokeWidth={1.4} />
                      </div>
                    )}
                  </div>
                  <div className="pd-related-body">
                    <span className="pd-related-cat">{category.name}</span>
                    <h3 className="pd-related-title">{p.name}</h3>
                    <span className="pd-related-cta">
                      {t("view_details")}
                      <ArrowUpRight size={12} strokeWidth={1.6} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
