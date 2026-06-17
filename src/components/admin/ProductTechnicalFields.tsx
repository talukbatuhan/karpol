"use client";

import { useRef, useState } from "react";
import type {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { ProductUpsertInput } from "@/lib/schemas/product";
import { uploadStorageFile } from "@/actions/storage-actions";
import { resolveProductFileUrl, resolveProductImageUrl } from "@/lib/product-image";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/FormField";

export interface ProductTechnicalFieldsProps {
  register: UseFormRegister<ProductUpsertInput>;
  control: Control<ProductUpsertInput>;
  watch: UseFormWatch<ProductUpsertInput>;
  setValue: UseFormSetValue<ProductUpsertInput>;
  errors: {
    technical_drawing?: { image?: { message?: string } };
    technical_table?: { columns?: { message?: string } };
  };
}

function padCells(cells: string[], length: number) {
  const next = [...cells];
  while (next.length < length) next.push("");
  return next.slice(0, length);
}

export function ProductTechnicalFields({
  register,
  control,
  watch,
  setValue,
  errors,
}: ProductTechnicalFieldsProps) {
  const drawingEnabled = watch("metadata.technical_drawing.enabled");
  const tableEnabled = watch("metadata.technical_table.enabled");

  const {
    fields: columnFields,
    append: appendColumn,
    remove: removeColumn,
  } = useFieldArray({
    control,
    name: "metadata.technical_table.columns",
  });

  const {
    fields: rowFields,
    append: appendRow,
    remove: removeRow,
  } = useFieldArray({
    control,
    name: "metadata.technical_table.rows",
  });

  const columnCount = columnFields.length;

  function handleAddColumn() {
    appendColumn({ header_tr: "", header_en: "" });
    const rows = watch("metadata.technical_table.rows") ?? [];
    rows.forEach((row, index) => {
      setValue(`metadata.technical_table.rows.${index}.cells_tr`, [
        ...padCells(row.cells_tr ?? [], columnCount),
        "",
      ]);
      setValue(`metadata.technical_table.rows.${index}.cells_en`, [
        ...padCells(row.cells_en ?? [], columnCount),
        "",
      ]);
    });
  }

  function handleRemoveColumn(index: number) {
    removeColumn(index);
    const rows = watch("metadata.technical_table.rows") ?? [];
    rows.forEach((row, rowIndex) => {
      const cellsTr = [...(row.cells_tr ?? [])];
      const cellsEn = [...(row.cells_en ?? [])];
      cellsTr.splice(index, 1);
      cellsEn.splice(index, 1);
      setValue(`metadata.technical_table.rows.${rowIndex}.cells_tr`, cellsTr);
      setValue(`metadata.technical_table.rows.${rowIndex}.cells_en`, cellsEn);
    });
  }

  function handleAddRow() {
    appendRow({
      cells_tr: padCells([], columnCount),
      cells_en: padCells([], columnCount),
    });
  }

  function seedTable() {
    appendColumn({ header_tr: "Ölçü", header_en: "Dimension" });
    appendColumn({ header_tr: "Değer", header_en: "Value" });
    appendRow({
      cells_tr: ["", ""],
      cells_en: ["", ""],
    });
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4 border border-border p-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 accent-gold-500"
            {...register("metadata.technical_drawing.enabled")}
          />
          <span className="font-mono text-xs uppercase tracking-widest text-gold-600">
            Teknik resim
          </span>
        </label>

        {drawingEnabled ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <TechnicalDrawingUpload
              value={watch("metadata.technical_drawing.image") ?? ""}
              setValue={setValue}
              error={errors.technical_drawing?.image?.message}
            />
            <FormField label="Başlık / açıklama (TR)">
              <Input {...register("metadata.technical_drawing.caption_tr")} />
            </FormField>
            <FormField label="Caption (EN)" className="sm:col-span-2">
              <Input {...register("metadata.technical_drawing.caption_en")} />
            </FormField>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Kapalıyken detay sayfasında teknik resim gösterilmez.
          </p>
        )}
      </section>

      <section className="space-y-4 border border-border p-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 accent-gold-500"
            {...register("metadata.technical_table.enabled", {
              onChange: (event) => {
                if (event.target.checked && columnFields.length === 0) {
                  seedTable();
                }
              },
            })}
          />
          <span className="font-mono text-xs uppercase tracking-widest text-gold-600">
            Teknik tablo
          </span>
        </label>

        {tableEnabled ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Tablo başlığı (TR)">
                <Input {...register("metadata.technical_table.title_tr")} />
              </FormField>
              <FormField label="Table title (EN)">
                <Input {...register("metadata.technical_table.title_en")} />
              </FormField>
            </div>

            {errors.technical_table?.columns?.message ? (
              <p className="text-sm text-destructive">
                {errors.technical_table.columns.message}
              </p>
            ) : null}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Sütunlar
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddColumn}
                  className="font-mono text-xs uppercase tracking-widest"
                >
                  + Sütun
                </Button>
              </div>
              {columnFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-2 border border-border p-3 sm:grid-cols-2"
                >
                  <Input
                    {...register(
                      `metadata.technical_table.columns.${index}.header_tr`,
                    )}
                    placeholder="Başlık TR"
                  />
                  <Input
                    {...register(
                      `metadata.technical_table.columns.${index}.header_en`,
                    )}
                    placeholder="Header EN"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveColumn(index)}
                    className="justify-start font-mono text-xs uppercase text-destructive sm:col-span-2"
                  >
                    Sütunu kaldır
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Satırlar
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddRow}
                  disabled={columnCount === 0}
                  className="font-mono text-xs uppercase tracking-widest"
                >
                  + Satır
                </Button>
              </div>
              {rowFields.map((field, rowIndex) => (
                <div
                  key={field.id}
                  className="space-y-2 border border-border p-3"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Satır {rowIndex + 1} — TR
                  </p>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${Math.max(columnCount, 1)}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: columnCount }).map((_, cellIndex) => (
                      <Input
                        key={`tr-${rowIndex}-${cellIndex}`}
                        {...register(
                          `metadata.technical_table.rows.${rowIndex}.cells_tr.${cellIndex}`,
                        )}
                        placeholder={`TR ${cellIndex + 1}`}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Row {rowIndex + 1} — EN
                  </p>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${Math.max(columnCount, 1)}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: columnCount }).map((_, cellIndex) => (
                      <Input
                        key={`en-${rowIndex}-${cellIndex}`}
                        {...register(
                          `metadata.technical_table.rows.${rowIndex}.cells_en.${cellIndex}`,
                        )}
                        placeholder={`EN ${cellIndex + 1}`}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(rowIndex)}
                    className="font-mono text-xs uppercase text-destructive"
                  >
                    Satırı kaldır
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Kapalıyken detay sayfasında teknik tablo gösterilmez.
          </p>
        )}
      </section>
    </div>
  );
}

function TechnicalDrawingUpload({
  value,
  setValue,
  error,
}: {
  value: string;
  setValue: UseFormSetValue<ProductUpsertInput>;
  error?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const lower = value.toLowerCase();
  const isPdf = lower.endsWith(".pdf");
  const previewUrl = isPdf
    ? resolveProductFileUrl(value)
    : resolveProductImageUrl(value);

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", "technical");

    const bucket =
      file.type === "application/pdf" ? "product-files" : "product-images";

    try {
      const result = await uploadStorageFile(bucket, formData);
      if ("error" in result && result.error) {
        setMessage(result.error);
        return;
      }
      if ("path" in result) {
        setValue("metadata.technical_drawing.image", result.path, {
          shouldDirty: true,
        });
        setMessage("Yüklendi");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <FormField
      label="Teknik resim dosyası"
      error={error}
      className="space-y-2 sm:col-span-2"
    >
      <Input
        value={value}
        onChange={(event) =>
          setValue("metadata.technical_drawing.image", event.target.value, {
            shouldDirty: true,
          })
        }
        placeholder="PNG, JPG veya PDF"
      />
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf,.pdf"
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
          className="font-mono text-[10px] uppercase tracking-widest"
        >
          {uploading ? "…" : "Yükle"}
        </Button>
      </div>
      {previewUrl && !isPdf ? (
        <div className="mt-2 overflow-hidden border border-border bg-muted">
          <ProportionalProductImage src={previewUrl} alt="" sizes="400px" />
        </div>
      ) : null}
      {previewUrl && isPdf ? (
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex font-mono text-[10px] uppercase tracking-widest text-gold-600 underline"
        >
          PDF önizle
        </a>
      ) : null}
      {message ? (
        <p className="font-mono text-[10px] text-muted-foreground">{message}</p>
      ) : null}
    </FormField>
  );
}
