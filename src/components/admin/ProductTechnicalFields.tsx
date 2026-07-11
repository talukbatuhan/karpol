"use client";

import { useRef, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { ProductUpsertInput } from "@/lib/schemas/product";
import {
  padRowToLength,
  parseMarkdownTable,
  parseMarkdownTableDataRows,
} from "@/lib/parse-markdown-table";
import { uploadStorageFile } from "@/actions/storage-actions";
import { resolveProductFileUrl, resolveProductImageUrl } from "@/lib/product-image";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/molecules/FormField";

export interface ProductTechnicalFieldsProps {
  register: UseFormRegister<ProductUpsertInput>;
  control: Control<ProductUpsertInput>;
  watch: UseFormWatch<ProductUpsertInput>;
  setValue: UseFormSetValue<ProductUpsertInput>;
  errors: FieldErrors<ProductUpsertInput>["metadata"];
}

function padCells(cells: string[], length: number) {
  const next = [...cells];
  while (next.length < length) next.push("");
  return next.slice(0, length);
}

function createSeededTable() {
  return {
    title_tr: "",
    title_en: "",
    columns: [
      { header_tr: "Ölçü", header_en: "Dimension" },
      { header_tr: "Değer", header_en: "Value" },
    ],
    rows: [{ cells_tr: ["", ""], cells_en: ["", ""] }],
  };
}

export function ProductTechnicalFields({
  register,
  control,
  watch,
  setValue,
  errors,
}: ProductTechnicalFieldsProps) {
  const drawingEnabled = watch("metadata.technical_drawing.enabled");

  const {
    fields: tableFields,
    append: appendTable,
    remove: removeTable,
  } = useFieldArray({
    control,
    name: "metadata.technical_tables",
  });

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
              error={errors?.technical_drawing?.image?.message}
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold-600">
              Teknik tablolar
            </p>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Ürünün farklı versiyonları için ayrı tablolar ekleyin. Her tablonun
              başlığı (ör. &quot;Standart&quot;, &quot;Ağır tip&quot;) sitede
              versiyon adı olarak görünür.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendTable(createSeededTable())}
            className="font-mono text-xs uppercase tracking-widest"
          >
            + Tablo ekle
          </Button>
        </div>

        {tableFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Henüz teknik tablo yok. Versiyon başına bir tablo ekleyebilirsiniz.
          </p>
        ) : (
          <div className="space-y-6">
            {tableFields.map((field, tableIndex) => (
              <TechnicalTableEditor
                key={field.id}
                tableIndex={tableIndex}
                tableCount={tableFields.length}
                register={register}
                control={control}
                watch={watch}
                setValue={setValue}
                columnsError={
                  typeof errors?.technical_tables?.[tableIndex]?.columns
                    ?.message === "string"
                    ? errors.technical_tables[tableIndex]?.columns?.message
                    : undefined
                }
                onRemove={() => removeTable(tableIndex)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TechnicalTableEditor({
  tableIndex,
  tableCount,
  register,
  control,
  watch,
  setValue,
  columnsError,
  onRemove,
}: {
  tableIndex: number;
  tableCount: number;
  register: UseFormRegister<ProductUpsertInput>;
  control: Control<ProductUpsertInput>;
  watch: UseFormWatch<ProductUpsertInput>;
  setValue: UseFormSetValue<ProductUpsertInput>;
  columnsError?: string;
  onRemove: () => void;
}) {
  const {
    fields: columnFields,
    append: appendColumn,
    remove: removeColumn,
    replace: replaceColumns,
  } = useFieldArray({
    control,
    name: `metadata.technical_tables.${tableIndex}.columns`,
  });

  const {
    fields: rowFields,
    append: appendRow,
    remove: removeRow,
    replace: replaceRows,
  } = useFieldArray({
    control,
    name: `metadata.technical_tables.${tableIndex}.rows`,
  });

  const [pasteText, setPasteText] = useState("");
  const [pasteMessage, setPasteMessage] = useState<string | null>(null);
  const [openRowIndexes, setOpenRowIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const columnCount = columnFields.length;
  const basePath = `metadata.technical_tables.${tableIndex}` as const;

  function expandAllRows() {
    setOpenRowIndexes(new Set(rowFields.map((_, index) => index)));
  }

  function collapseAllRows() {
    setOpenRowIndexes(new Set());
  }

  function toggleRow(rowIndex: number) {
    setOpenRowIndexes((current) => {
      const next = new Set(current);
      if (next.has(rowIndex)) next.delete(rowIndex);
      else next.add(rowIndex);
      return next;
    });
  }

  function handleAddColumn() {
    appendColumn({ header_tr: "", header_en: "" });
    const rows = watch(`${basePath}.rows`) ?? [];
    rows.forEach((row, index) => {
      setValue(`${basePath}.rows.${index}.cells_tr`, [
        ...padCells(row.cells_tr ?? [], columnCount),
        "",
      ]);
      setValue(`${basePath}.rows.${index}.cells_en`, [
        ...padCells(row.cells_en ?? [], columnCount),
        "",
      ]);
    });
  }

  function handleRemoveColumn(index: number) {
    removeColumn(index);
    const rows = watch(`${basePath}.rows`) ?? [];
    rows.forEach((row, rowIndex) => {
      const cellsTr = [...(row.cells_tr ?? [])];
      const cellsEn = [...(row.cells_en ?? [])];
      cellsTr.splice(index, 1);
      cellsEn.splice(index, 1);
      setValue(`${basePath}.rows.${rowIndex}.cells_tr`, cellsTr);
      setValue(`${basePath}.rows.${rowIndex}.cells_en`, cellsEn);
    });
  }

  function handleAddRow() {
    const nextIndex = rowFields.length;
    appendRow({
      cells_tr: padCells([], columnCount),
      cells_en: padCells([], columnCount),
    });
    setOpenRowIndexes((current) => new Set(current).add(nextIndex));
  }

  function applyImportedTable(
    headers: string[],
    dataRows: string[][],
    mode: "replace" | "append",
  ) {
    if (mode === "replace") {
      replaceColumns(
        headers.map((header) => ({ header_tr: header, header_en: header })),
      );
      replaceRows(
        dataRows.map((row) => ({
          cells_tr: row,
          cells_en: [...row],
        })),
      );
      setPasteMessage(
        `${headers.length} sütun, ${dataRows.length} satır içe aktarıldı.`,
      );
      setOpenRowIndexes(new Set());
      return;
    }

    const existingColumns = watch(`${basePath}.columns`) ?? [];
    const existingRows = watch(`${basePath}.rows`) ?? [];
    const colCount = existingColumns.length;

    if (colCount === 0) {
      setPasteMessage("Önce tabloyu içe aktarın veya en az bir sütun ekleyin.");
      return;
    }

    const normalized = dataRows.map((row) => padRowToLength(row, colCount));
    replaceRows([
      ...existingRows,
      ...normalized.map((row) => ({
        cells_tr: row,
        cells_en: [...row],
      })),
    ]);
    setPasteMessage(`${normalized.length} satır eklendi.`);
    setOpenRowIndexes(new Set());
  }

  function handlePasteImport() {
    setPasteMessage(null);
    const result = parseMarkdownTable(pasteText);
    if (!result.ok) {
      setPasteMessage(result.error);
      return;
    }
    applyImportedTable(result.table.headers, result.table.rows, "replace");
    setPasteText("");
  }

  function handlePasteAppend() {
    setPasteMessage(null);
    const result = parseMarkdownTableDataRows(pasteText);
    if (!result.ok) {
      setPasteMessage(result.error);
      return;
    }
    applyImportedTable([], result.table.rows, "append");
    setPasteText("");
  }

  return (
    <div className="space-y-4 border border-navy-800/20 bg-muted/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-navy-800">
          Tablo {tableIndex + 1} / {tableCount}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="font-mono text-xs uppercase tracking-widest text-destructive"
        >
          Tabloyu kaldır
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Versiyon / tablo adı (TR)">
          <Input
            {...register(`${basePath}.title_tr`)}
            placeholder="örn. Standart versiyon"
          />
        </FormField>
        <FormField label="Version / table name (EN)">
          <Input
            {...register(`${basePath}.title_en`)}
            placeholder="e.g. Standard version"
          />
        </FormField>
      </div>

      {columnsError ? (
        <p className="text-sm text-destructive">{columnsError}</p>
      ) : null}

      <div className="space-y-3 rounded-lg border border-dashed border-gold-500/40 bg-background/60 p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold-600">
          Markdown / Excel yapıştır
        </p>
        <Textarea
          value={pasteText}
          onChange={(event) => setPasteText(event.target.value)}
          placeholder={`| MODEL | Dış Çap (A) | İç Çap (B) |\n| :---- | ----------: | ---------: |\n| KRP-KPL-001 | 62 | 21 |`}
          rows={5}
          className="font-mono text-xs"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePasteImport}
            disabled={!pasteText.trim()}
            className="font-mono text-xs uppercase tracking-widest"
          >
            Tabloyu içe aktar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePasteAppend}
            disabled={!pasteText.trim() || columnCount === 0}
            className="font-mono text-xs uppercase tracking-widest"
          >
            Satır ekle
          </Button>
        </div>
        {pasteMessage ? (
          <p className="font-mono text-[10px] text-muted-foreground">
            {pasteMessage}
          </p>
        ) : null}
      </div>

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
              {...register(`${basePath}.columns.${index}.header_tr`)}
              placeholder="Başlık TR"
            />
            <Input
              {...register(`${basePath}.columns.${index}.header_en`)}
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Satırlar ({rowFields.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {rowFields.length > 0 ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={expandAllRows}
                  className="font-mono text-xs uppercase tracking-widest"
                >
                  Tümünü aç
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={collapseAllRows}
                  className="font-mono text-xs uppercase tracking-widest"
                >
                  Tümünü kapat
                </Button>
              </>
            ) : null}
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
        </div>

        {rowFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Henüz satır yok. Markdown içe aktarın veya satır ekleyin.
          </p>
        ) : (
          <div className="max-h-[28rem] space-y-2 overflow-y-auto border border-border bg-background/40 p-2">
            {rowFields.map((field, rowIndex) => {
              const preview =
                watch(`${basePath}.rows.${rowIndex}.cells_tr.0`)?.trim() ||
                watch(`${basePath}.rows.${rowIndex}.cells_en.0`)?.trim() ||
                "Boş satır";

              return (
                <details
                  key={field.id}
                  className="group border border-border bg-muted/20 open:bg-muted/40"
                  open={openRowIndexes.has(rowIndex)}
                >
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden"
                    onClick={(event) => {
                      event.preventDefault();
                      toggleRow(rowIndex);
                    }}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden
                        className={`font-mono text-xs text-gold-600 transition-transform ${
                          openRowIndexes.has(rowIndex) ? "rotate-90" : ""
                        }`}
                      >
                        ›
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Satır {rowIndex + 1}
                      </span>
                      <span className="truncate font-sans text-sm text-navy-950">
                        {preview}
                      </span>
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeRow(rowIndex);
                        setOpenRowIndexes((current) => {
                          const next = new Set<number>();
                          current.forEach((index) => {
                            if (index < rowIndex) next.add(index);
                            else if (index > rowIndex) next.add(index - 1);
                          });
                          return next;
                        });
                      }}
                      className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-destructive"
                    >
                      Sil
                    </Button>
                  </summary>

                  <div className="space-y-2 border-t border-border px-3 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      TR
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
                            `${basePath}.rows.${rowIndex}.cells_tr.${cellIndex}`,
                          )}
                          placeholder={`TR ${cellIndex + 1}`}
                        />
                      ))}
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      EN
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
                            `${basePath}.rows.${rowIndex}.cells_en.${cellIndex}`,
                          )}
                          placeholder={`EN ${cellIndex + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
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
