"use client";

import { useEffect, useRef, useState } from "react";
import {
  useFieldArray,
  useWatch,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import type { EcatalogLink } from "@/types/ecatalog";
import type { EcatalogUpsertFormValues } from "@/lib/schemas/ecatalog";
import { resolveEcatalogImageUrl } from "@/lib/ecatalog-image";
import { uploadEcatalogImage } from "@/lib/ecatalog-pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/FormField";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { EcatalogHotspotIcon, EcatalogHotspotMarker } from "@/components/ecatalog/EcatalogHotspotMarker";

function createLink(x: number, y: number): EcatalogLink {
  return {
    id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    side: "left",
    x: Math.max(0, Math.min(92, x - 2.5)),
    y: Math.max(0, Math.min(94, y - 2.5)),
    w: 5,
    h: 5,
    product_slug: "",
  };
}

export interface EcatalogPageEditorProps {
  control: Control<EcatalogUpsertFormValues>;
  register: UseFormRegister<EcatalogUpsertFormValues>;
  setValue: UseFormSetValue<EcatalogUpsertFormValues>;
  spreadIndex: number;
  pageNumber: number;
  productSlugs: string[];
  defaultExpanded?: boolean;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function EcatalogPageEditor({
  control,
  register,
  setValue,
  spreadIndex,
  pageNumber,
  productSlugs,
  defaultExpanded = false,
  onRemove,
  onMoveUp,
  onMoveDown,
}: EcatalogPageEditorProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const isMountedRef = useRef(false);
  const didAutoExpandRef = useRef(false);

  const imagePath =
    useWatch({ control, name: `spreads.${spreadIndex}.left_image` }) ?? "";
  const links =
    (useWatch({ control, name: `spreads.${spreadIndex}.links` }) as
      | EcatalogLink[]
      | undefined) ?? [];

  const { fields: linkFields, append: appendLink, remove: removeLink } =
    useFieldArray({
      control,
      name: `spreads.${spreadIndex}.links`,
      keyName: "fieldId",
    });

  const preview = resolveEcatalogImageUrl(imagePath);
  const datalistId = `ecatalog-product-slugs-${spreadIndex}`;
  const imageField = register(`spreads.${spreadIndex}.left_image`);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!didAutoExpandRef.current && links.length > 0) {
      setExpanded(true);
      didAutoExpandRef.current = true;
    }
  }, [links.length]);

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadMessage(null);
    try {
      const path = await uploadEcatalogImage(file);
      if (!isMountedRef.current) return;
      if (path) {
        setValue(`spreads.${spreadIndex}.left_image`, path, { shouldDirty: true });
      } else setUploadMessage("Yükleme başarısız.");
    } finally {
      if (!isMountedRef.current) return;
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleImageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!expanded || !containerRef.current || !preview) return;
    if ((event.target as HTMLElement).closest("[data-ecatalog-hotspot]")) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    appendLink(createLink(x, y));
    setExpanded(true);
  }

  return (
    <section className="border border-border">
      <div className="flex items-center gap-3 bg-muted/40 px-3 py-2">
        {preview ? (
          <div className="h-12 w-9 shrink-0 overflow-hidden border border-border bg-muted">
            <ProportionalProductImage src={preview} alt="" sizes="48px" />
          </div>
        ) : (
          <div className="flex h-12 w-9 shrink-0 items-center justify-center border border-dashed border-border text-[10px] text-muted-foreground">
            —
          </div>
        )}
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setExpanded((value) => !value)}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-gold-600">
            Sayfa {pageNumber}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {imagePath || "Görsel yok"}
            {links.length > 0 ? ` · ${links.length} link` : ""}
          </p>
        </button>
        <div className="flex shrink-0 gap-1">
          {onMoveUp ? (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveUp}>
              ↑
            </Button>
          ) : null}
          {onMoveDown ? (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveDown}>
              ↓
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive"
          >
            Sil
          </Button>
        </div>
      </div>

      {expanded ? (
        <div className="space-y-4 p-4">
          <FormField label="Sayfa görseli">
            <Input {...imageField} />
            <div className="mt-2 flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? "…" : "Yükle"}
              </Button>
            </div>
            {uploadMessage ? (
              <p className="mt-1 text-xs text-destructive">{uploadMessage}</p>
            ) : null}
          </FormField>

          {preview ? (
            <div
              ref={containerRef}
              className="relative max-w-md cursor-crosshair overflow-hidden border border-border bg-muted"
              onClick={handleImageClick}
              role="presentation"
            >
              <ProportionalProductImage src={preview} alt="" sizes="400px" />
              {links.map((link, index) => {
                const hasSlug = Boolean(link.product_slug?.trim());
                const toPercent = (value: unknown) => {
                  const n = typeof value === "number" ? value : Number(value);
                  return Number.isFinite(n) ? n : 0;
                };
                return (
                  <EcatalogHotspotMarker
                    key={link.id || linkFields[index]?.id || index}
                    x={toPercent(link.x)}
                    y={toPercent(link.y)}
                    w={toPercent(link.w)}
                    h={toPercent(link.h)}
                    complete={hasSlug}
                    hint={hasSlug ? "Detayları Gör" : "Ürün slug girin"}
                    title={
                      hasSlug
                        ? link.product_slug
                        : `Link ${index + 1} — slug girilmedi`
                    }
                    className="pointer-events-auto"
                  />
                );
              })}
            </div>
          ) : null}

          <p className="text-xs text-muted-foreground">
            Ürün linki eklemek için görsele tıklayın. Site önizlemesiyle aynı küçük
            ikon görünür; slug girilince ziyaretçiler &quot;Detayları Gör&quot; ipucunu
            görür.
          </p>

          {linkFields.map((linkField, linkIndex) => {
            const link = links[linkIndex];
            const slug = link?.product_slug ?? "";

            return (
              <div
                key={linkField.id}
                className="grid gap-2 border border-border p-3 sm:grid-cols-2"
              >
                <div className="flex items-center gap-2 sm:col-span-2">
                  <span className="group relative flex h-5 w-5 shrink-0 items-center justify-center">
                    <EcatalogHotspotIcon complete={Boolean(slug.trim())} />
                  </span>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Link {linkIndex + 1}
                    {slug.trim() ? ` · ${slug}` : " · slug girilmedi"}
                  </p>
                </div>
                <FormField label={`Ürün slug #${linkIndex + 1}`}>
                  <Input
                    list={datalistId}
                    placeholder="krp-kpl-001"
                    {...register(
                      `spreads.${spreadIndex}.links.${linkIndex}.product_slug`,
                    )}
                  />
                </FormField>
                <FormField label="Etiket TR">
                  <Input
                    {...register(
                      `spreads.${spreadIndex}.links.${linkIndex}.label_tr`,
                    )}
                  />
                </FormField>
                <div className="grid grid-cols-4 gap-2 sm:col-span-2">
                  {(["x", "y", "w", "h"] as const).map((key) => (
                    <FormField key={key} label={key.toUpperCase()}>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        {...register(
                          `spreads.${spreadIndex}.links.${linkIndex}.${key}`,
                        )}
                      />
                    </FormField>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(linkIndex)}
                  className="justify-start text-destructive sm:col-span-2"
                >
                  Linki kaldır
                </Button>
              </div>
            );
          })}

          {productSlugs.length > 0 ? (
            <datalist id={datalistId}>
              {productSlugs.map((slug) => (
                <option key={slug} value={slug} />
              ))}
            </datalist>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
