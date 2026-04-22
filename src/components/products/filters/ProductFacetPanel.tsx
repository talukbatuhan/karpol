"use client";

import { Search } from "lucide-react";
import type { CategoryAttributeDefinition } from "@/types/database";

export function formatFacetValueFromProduct(v: unknown): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "boolean") return v ? "yes" : "no";
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map((x) => String(x)).join(", ");
  return String(v).trim();
}

type ProductFacetPanelProps = {
  searchLabel: string;
  searchPlaceholder: string;
  query: string;
  onQueryChange: (q: string) => void;
  materialLabel: string;
  materialOptions: string[];
  materialFilters: Set<string>;
  onToggleMaterial: (value: string) => void;
  hardnessLabel: string;
  hardnessOptions: string[];
  hardnessFilters: Set<string>;
  onToggleHardness: (value: string) => void;
  showMaterial: boolean;
  showHardness: boolean;
  filterableDefinitions: CategoryAttributeDefinition[];
  customOptions: Record<string, string[]>;
  customFilters: Record<string, Set<string>>;
  onToggleCustom: (key: string, value: string) => void;
  locale: string;
};

function labelForDef(def: CategoryAttributeDefinition, locale: string) {
  return locale === "tr" ? def.label_tr || def.key : def.label_en || def.key;
}

export default function ProductFacetPanel({
  searchLabel,
  searchPlaceholder,
  query,
  onQueryChange,
  materialLabel,
  materialOptions,
  materialFilters,
  onToggleMaterial,
  hardnessLabel,
  hardnessOptions,
  hardnessFilters,
  onToggleHardness,
  showMaterial,
  showHardness,
  filterableDefinitions,
  customOptions,
  customFilters,
  onToggleCustom,
  locale,
}: ProductFacetPanelProps) {
  return (
    <>
      <div className="pp-filter-group">
        <h3 className="pp-filter-label">{searchLabel}</h3>
        <div className="pp-search-wrap">
          <Search size={14} strokeWidth={1.8} />
          <input
            type="search"
            className="pp-search-input"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
      </div>

      {showMaterial && materialOptions.length > 0 && (
        <div className="pp-filter-group">
          <h3 className="pp-filter-label">{materialLabel}</h3>
          <div className="pp-check-list">
            {materialOptions.map((value) => {
              const checked = materialFilters.has(value);
              return (
                <label key={value} className={`pp-check-label${checked ? " checked" : ""}`}>
                  <span className="pp-check-box">
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1.5 5L4 7.5L8.5 2.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleMaterial(value)}
                    style={{ display: "none" }}
                  />
                  {value}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {showHardness && hardnessOptions.length > 0 && (
        <div className="pp-filter-group">
          <h3 className="pp-filter-label">{hardnessLabel}</h3>
          <div className="pp-check-list">
            {hardnessOptions.map((value) => {
              const checked = hardnessFilters.has(value);
              return (
                <label key={value} className={`pp-check-label${checked ? " checked" : ""}`}>
                  <span className="pp-check-box">
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1.5 5L4 7.5L8.5 2.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleHardness(value)}
                    style={{ display: "none" }}
                  />
                  {value}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {filterableDefinitions.map((def) => {
        const opts = customOptions[def.key] ?? [];
        if (opts.length === 0) return null;
        const selected = customFilters[def.key] ?? new Set<string>();
        return (
          <div key={def.key} className="pp-filter-group">
            <h3 className="pp-filter-label">{labelForDef(def, locale)}</h3>
            <div className="pp-check-list">
              {opts.map((value) => {
                const checked = selected.has(value);
                return (
                  <label key={value} className={`pp-check-label${checked ? " checked" : ""}`}>
                    <span className="pp-check-box">
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M1.5 5L4 7.5L8.5 2.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleCustom(def.key, value)}
                      style={{ display: "none" }}
                    />
                    {value}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
