"use client";

import { useRef, useState } from "react";
import type { EcatalogLink } from "@/types/ecatalog";
import { resolveEcatalogImageUrl } from "@/lib/ecatalog-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/FormField";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";

type EcatalogSpreadLinksEditorProps = {
  side: "left" | "right";
  imagePath: string;
  links: EcatalogLink[];
  productSlugs: string[];
  onChange: (links: EcatalogLink[]) => void;
};

function createLink(
  side: EcatalogLink["side"],
  x: number,
  y: number,
): EcatalogLink {
  return {
    id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    side,
    x: Math.max(0, Math.min(88, x - 6)),
    y: Math.max(0, Math.min(88, y - 4)),
    w: 12,
    h: 8,
    product_slug: "",
  };
}

function PageHotspotEditor({
  side,
  imagePath,
  links,
  productSlugs,
  onChange,
}: EcatalogSpreadLinksEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageUrl = resolveEcatalogImageUrl(imagePath);

  function handleImageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current || !imageUrl) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onChange([...links, createLink(side, x, y)]);
  }

  function updateLink(index: number, patch: Partial<EcatalogLink>) {
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }

  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 border border-border p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {side === "left" ? "Sol sayfa" : "Sağ sayfa"} — ürün linkleri
      </p>
      {imageUrl ? (
        <div
          ref={containerRef}
          className="relative cursor-crosshair overflow-hidden border border-border bg-muted"
          onClick={handleImageClick}
          role="presentation"
        >
          <ProportionalProductImage src={imageUrl} alt="" sizes="400px" />
          {links.map((link, index) => (
            <span
              key={link.id}
              className="pointer-events-none absolute border-2 border-gold-500 bg-gold-500/25"
              style={{
                left: `${link.x}%`,
                top: `${link.y}%`,
                width: `${link.w}%`,
                height: `${link.h}%`,
              }}
              title={`#${index + 1}`}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Önce sayfa görseli yükleyin, ardından görsele tıklayarak link ekleyin.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Görsele tıklayarak ürün linki alanı ekleyin.
      </p>
      {links.map((link, index) => (
        <div key={link.id} className="grid gap-2 border border-border p-3 sm:grid-cols-2">
          <FormField label={`Ürün slug #${index + 1}`}>
            <Input
              list="ecatalog-product-slugs"
              value={link.product_slug}
              onChange={(event) =>
                updateLink(index, { product_slug: event.target.value.trim() })
              }
              placeholder="krp-kpl-001"
            />
          </FormField>
          <FormField label="Etiket TR (isteğe bağlı)">
            <Input
              value={link.label_tr ?? ""}
              onChange={(event) => updateLink(index, { label_tr: event.target.value })}
            />
          </FormField>
          <FormField label="Label EN (optional)">
            <Input
              value={link.label_en ?? ""}
              onChange={(event) => updateLink(index, { label_en: event.target.value })}
            />
          </FormField>
          <div className="grid grid-cols-4 gap-2 sm:col-span-2">
            {(["x", "y", "w", "h"] as const).map((key) => (
              <FormField key={key} label={key.toUpperCase()}>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={link[key]}
                  onChange={(event) =>
                    updateLink(index, { [key]: Number(event.target.value) || 0 })
                  }
                />
              </FormField>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeLink(index)}
            className="justify-start font-mono text-xs uppercase text-destructive sm:col-span-2"
          >
            Linki kaldır
          </Button>
        </div>
      ))}
      {productSlugs.length > 0 ? (
        <datalist id="ecatalog-product-slugs">
          {productSlugs.map((slug) => (
            <option key={slug} value={slug} />
          ))}
        </datalist>
      ) : null}
    </div>
  );
}

export interface EcatalogSpreadEditorProps {
  index: number;
  leftImage: string;
  rightImage: string;
  links: EcatalogLink[];
  productSlugs: string[];
  onLeftImageChange: (path: string) => void;
  onRightImageChange: (path: string) => void;
  onLinksChange: (links: EcatalogLink[]) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function EcatalogSpreadEditor({
  index,
  leftImage,
  rightImage,
  links,
  productSlugs,
  onLeftImageChange,
  onRightImageChange,
  onLinksChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: EcatalogSpreadEditorProps) {
  const leftLinks = links.filter((link) => link.side === "left");
  const rightLinks = links.filter((link) => link.side === "right");

  function setSideLinks(side: EcatalogLink["side"], sideLinks: EcatalogLink[]) {
    const other = links.filter((link) => link.side !== side);
    onLinksChange([...other, ...sideLinks]);
  }

  return (
    <section className="space-y-4 border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gold-600">
          Sayfa çifti {index + 1}
        </h3>
        <div className="flex flex-wrap gap-2">
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
            Kaldır
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SpreadImageUpload
          label="Sol sayfa görseli"
          value={leftImage}
          onChange={onLeftImageChange}
        />
        <SpreadImageUpload
          label="Sağ sayfa görseli"
          value={rightImage}
          onChange={onRightImageChange}
        />
      </div>

      <PageHotspotEditor
        side="left"
        imagePath={leftImage}
        links={leftLinks}
        productSlugs={productSlugs}
        onChange={(next) => setSideLinks("left", next)}
      />
      <PageHotspotEditor
        side="right"
        imagePath={rightImage}
        links={rightLinks}
        productSlugs={productSlugs}
        onChange={(next) => setSideLinks("right", next)}
      />
    </section>
  );
}

function SpreadImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const preview = resolveEcatalogImageUrl(value);

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", "ecatalog");

    try {
      const { uploadStorageFile } = await import("@/actions/storage-actions");
      const result = await uploadStorageFile("product-images", formData);
      if ("error" in result && result.error) {
        setMessage(result.error);
        return;
      }
      if ("path" in result && result.path) onChange(result.path);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <FormField label={label} className="space-y-2">
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
      <div className="flex gap-2">
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
      {preview ? (
        <div className="overflow-hidden border border-border">
          <ProportionalProductImage src={preview} alt="" sizes="300px" />
        </div>
      ) : null}
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </FormField>
  );
}
