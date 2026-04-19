'use client'

import { Fragment, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ClipboardPaste,
  Hash,
  Plus,
  Settings2,
  Trash2,
  Wand2,
  X,
} from 'lucide-react'
import type {
  SizeColumn,
  SizeColumnAlign,
  SizeColumnAutoFill,
  SizeRow,
  SizeTable,
} from '@/types/database'
import { slugify } from '@/lib/i18n-helpers'
import styles from '@/app/admin/admin.module.css'

interface SizeTableBuilderProps {
  value: SizeTable
  onChange: (next: SizeTable) => void
}

type Template = {
  id: string
  label: string
  columns: SizeColumn[]
}

const TEMPLATES: Template[] = [
  {
    id: 'default',
    label: 'Varsayılan (Ölçü / Kanat / Genişlik / İç-Dış Çap)',
    columns: [
      { key: 'olcu', label: { tr: 'Ölçü', en: 'Size' }, align: 'left' },
      { key: 'kanat', label: { tr: 'Kanat', en: 'Wing' }, align: 'center' },
      { key: 'genislik', label: { tr: 'Genişlik', en: 'Width' }, unit: 'mm', align: 'right' },
      { key: 'ic-cap', label: { tr: 'İç Çap', en: 'Inner Ø' }, unit: 'mm', align: 'right' },
      { key: 'dis-cap', label: { tr: 'Dış Çap', en: 'Outer Ø' }, unit: 'mm', align: 'right' },
    ],
  },
  {
    id: 'rulman',
    label: 'Rulman / Burç (Model + İç Ø / Dış Ø / Yükseklik)',
    columns: [
      {
        key: 'model',
        label: { tr: 'Model', en: 'Model' },
        align: 'left',
        autoFill: { enabled: true, prefix: 'KRP-RB/', padding: 2, start: 1 },
      },
      { key: 'ic-cap', label: { tr: 'İç Çap', en: 'Inner Ø' }, unit: 'mm', align: 'right' },
      { key: 'dis-cap', label: { tr: 'Dış Çap', en: 'Outer Ø' }, unit: 'mm', align: 'right' },
      { key: 'yukseklik', label: { tr: 'Yükseklik', en: 'Height' }, unit: 'mm', align: 'right' },
    ],
  },
  {
    id: 'takoz-tip-a',
    label: 'Titreşim Takozu (Tip-A: Çap / h / m / l + Sertlik)',
    columns: [
      {
        key: 'model',
        label: { tr: 'Model', en: 'Model' },
        align: 'left',
        autoFill: { enabled: true, prefix: 'KRP-ST/', padding: 2, start: 1 },
      },
      { key: 'cap', label: { tr: 'Çap Ø', en: 'Diameter Ø' }, unit: 'mm', align: 'right' },
      { key: 'h', label: { tr: 'h', en: 'h' }, unit: 'mm', align: 'right' },
      { key: 'm', label: { tr: 'Vida', en: 'Thread' }, align: 'center' },
      { key: 'l', label: { tr: 'l', en: 'l' }, unit: 'mm', align: 'right' },
      { key: 'sertlik-45', label: { tr: '45 Sh', en: '45 Sh' }, unit: 'N/mm', align: 'right' },
      { key: 'sertlik-57', label: { tr: '57 Sh', en: '57 Sh' }, unit: 'N/mm', align: 'right' },
      { key: 'sertlik-70', label: { tr: '70 Sh', en: '70 Sh' }, unit: 'N/mm', align: 'right' },
    ],
  },
  {
    id: 'silindir',
    label: 'Silindir / Tekerlek (Model + Çap / Genişlik / Yük)',
    columns: [
      {
        key: 'model',
        label: { tr: 'Model', en: 'Model' },
        align: 'left',
        autoFill: { enabled: true, prefix: 'KRP-SL/', padding: 2, start: 1 },
      },
      { key: 'cap', label: { tr: 'Çap', en: 'Diameter' }, unit: 'mm', align: 'right' },
      { key: 'genislik', label: { tr: 'Genişlik', en: 'Width' }, unit: 'mm', align: 'right' },
      { key: 'yuk', label: { tr: 'Yük', en: 'Load' }, unit: 'kg', align: 'right' },
    ],
  },
]

function ensureUniqueKey(base: string, existing: SizeColumn[]): string {
  const candidate = slugify(base) || `kolon-${existing.length + 1}`
  if (!existing.some((c) => c.key === candidate)) return candidate
  let i = 2
  while (existing.some((c) => c.key === `${candidate}-${i}`)) i++
  return `${candidate}-${i}`
}

/** Bir auto-fill yapılandırmasından N. değeri üretir. (index 0-based) */
function computeAutoValue(autoFill: SizeColumnAutoFill, index: number): string {
  const num = autoFill.start + index
  return `${autoFill.prefix}${String(num).padStart(autoFill.padding, '0')}`
}

/**
 * Sütun anahtarı (key) için lokal draft state tutan input.
 * - Yazarken hiçbir sanitize yapılmaz (Türkçe harf, boşluk, büyük harf serbest).
 * - Blur veya Enter olduğunda parent'a slugified haliyle commit edilir.
 * Bu sayede typing experience pürüzsüz, cursor zıplamaz.
 */
function ColumnKeyInput({
  value,
  onCommit,
  inputClassName,
}: {
  value: string
  onCommit: (next: string) => void
  inputClassName: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const display = draft ?? value
  return (
    <input
      type="text"
      className={inputClassName}
      value={display}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={() => setDraft(value)}
      onBlur={() => {
        if (draft !== null && draft !== value) onCommit(draft)
        setDraft(null)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          ;(e.target as HTMLInputElement).blur()
        } else if (e.key === 'Escape') {
          setDraft(null)
          ;(e.target as HTMLInputElement).blur()
        }
      }}
      placeholder="model"
      style={{ padding: '6px 10px', fontSize: 13, fontFamily: 'monospace' }}
      dir="ltr"
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
    />
  )
}

/**
 * Excel/Sheets'ten kopyalanan TSV/CSV metnini 2D string dizisine çevirir.
 * - Önce tab'a, yoksa noktalı virgüle, yoksa virgüle göre böler
 * - Tüm satırların hepsi boşsa atılır (trailing empty satırları siler)
 */
function parsePasteText(text: string): string[][] {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const allLines = normalized.split('\n')
  // Drop trailing empty lines only
  let endIdx = allLines.length
  while (endIdx > 0 && allLines[endIdx - 1].trim().length === 0) endIdx--
  const lines = allLines.slice(0, endIdx)
  return lines.map((line) => {
    if (line.includes('\t')) return line.split('\t').map((c) => c.trim())
    if (line.includes(';')) return line.split(';').map((c) => c.trim())
    if (line.includes(',')) return line.split(',').map((c) => c.trim())
    return [line.trim()]
  })
}

export default function SizeTableBuilder({
  value,
  onChange,
}: SizeTableBuilderProps) {
  const columns = value?.columns ?? []
  const rows = value?.rows ?? []

  const isEmpty = columns.length === 0
  const colCount = useMemo(() => columns.length, [columns])

  const [showBulkImport, setShowBulkImport] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [bulkMode, setBulkMode] = useState<'append' | 'replace'>('append')
  const [bulkSkipFirstRow, setBulkSkipFirstRow] = useState(false)

  const setColumns = (next: SizeColumn[]) => {
    const allowed = new Set(next.map((c) => c.key))
    const cleanedRows: SizeRow[] = rows.map((r) => {
      const out: SizeRow = {}
      for (const k of allowed) out[k] = r[k] ?? ''
      return out
    })
    onChange({ columns: next, rows: cleanedRows })
  }

  const setRows = (next: SizeRow[]) => {
    onChange({ columns, rows: next })
  }

  const addColumn = () => {
    const base = `Yeni Sütun ${columns.length + 1}`
    const key = ensureUniqueKey(base, columns)
    setColumns([
      ...columns,
      { key, label: { tr: base, en: `New Column ${columns.length + 1}` }, align: 'left' },
    ])
  }

  const updateColumn = (index: number, patch: Partial<SizeColumn>) => {
    const next = [...columns]
    let updated = { ...next[index], ...patch }

    if (patch.key !== undefined) {
      const requested = slugify(patch.key) || next[index].key
      const others = next.filter((_, i) => i !== index)
      const newKey = ensureUniqueKey(requested, others)
      const oldKey = next[index].key
      updated = { ...updated, key: newKey }
      if (newKey !== oldKey) {
        const renamedRows: SizeRow[] = rows.map((r) => {
          const out: SizeRow = { ...r }
          out[newKey] = r[oldKey] ?? ''
          delete out[oldKey]
          return out
        })
        next[index] = updated
        onChange({ columns: next, rows: renamedRows })
        return
      }
    }

    next[index] = updated
    onChange({ columns: next, rows })
  }

  const updateAutoFill = (
    index: number,
    patch: Partial<SizeColumnAutoFill>,
  ) => {
    const current = columns[index].autoFill ?? {
      enabled: false,
      prefix: '',
      padding: 2,
      start: 1,
    }
    updateColumn(index, { autoFill: { ...current, ...patch } })
  }

  const toggleAutoFill = (index: number) => {
    const current = columns[index].autoFill
    if (current?.enabled) {
      updateColumn(index, { autoFill: undefined })
    } else {
      updateColumn(index, {
        autoFill: { enabled: true, prefix: 'KRP-ST/', padding: 2, start: 1 },
      })
    }
  }

  const fillColumnAutoValues = (colIndex: number, overwrite: boolean) => {
    const col = columns[colIndex]
    if (!col?.autoFill?.enabled) return
    const auto = col.autoFill
    const next = rows.map((r, rowIndex) => {
      const existing = r[col.key]
      if (!overwrite && existing && existing.trim().length > 0) return r
      return { ...r, [col.key]: computeAutoValue(auto, rowIndex) }
    })
    setRows(next)
  }

  const removeColumn = (index: number) => {
    const removed = columns[index]
    const next = columns.filter((_, i) => i !== index)
    const cleanedRows: SizeRow[] = rows.map((r) => {
      const out = { ...r }
      delete out[removed.key]
      return out
    })
    onChange({ columns: next, rows: cleanedRows })
  }

  const moveColumn = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= columns.length) return
    const next = [...columns]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setColumns(next)
  }

  const addRow = () => {
    const fresh: SizeRow = {}
    const newRowIndex = rows.length
    for (const c of columns) {
      if (c.autoFill?.enabled) {
        fresh[c.key] = computeAutoValue(c.autoFill, newRowIndex)
      } else {
        fresh[c.key] = ''
      }
    }
    setRows([...rows, fresh])
  }

  const updateCell = (rowIndex: number, key: string, text: string) => {
    const next = [...rows]
    next[rowIndex] = { ...next[rowIndex], [key]: text }
    setRows(next)
  }

  /**
   * 2D grid'i (startRow, startCol)'dan başlayarak tabloya yazar.
   * Gerekirse yeni satır ekler ve auto-fill sütunlarını otomatik doldurur.
   */
  const applyGrid = (startRow: number, startCol: number, grid: string[][]) => {
    if (columns.length === 0) return
    const next: SizeRow[] = rows.map((r) => ({ ...r }))
    for (let i = 0; i < grid.length; i++) {
      const targetRow = startRow + i
      if (targetRow >= next.length) {
        const fresh: SizeRow = {}
        for (const c of columns) {
          if (c.autoFill?.enabled) {
            fresh[c.key] = computeAutoValue(c.autoFill, targetRow)
          } else {
            fresh[c.key] = ''
          }
        }
        next.push(fresh)
      }
      const rowData = { ...next[targetRow] }
      for (let j = 0; j < grid[i].length; j++) {
        const targetCol = startCol + j
        if (targetCol >= columns.length) break
        const colKey = columns[targetCol].key
        rowData[colKey] = grid[i][j]
      }
      next[targetRow] = rowData
    }
    setRows(next)
  }

  /** Hücreye yapıştırıldığında çağrılır; çok hücreli içerikleri otomatik dağıtır. */
  const handleCellPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number,
  ) => {
    const text = e.clipboardData.getData('text')
    if (!text) return
    const grid = parsePasteText(text)
    if (grid.length === 0) return
    if (grid.length === 1 && grid[0].length === 1) return
    e.preventDefault()
    applyGrid(rowIndex, colIndex, grid)
  }

  const applyBulkImport = () => {
    if (!bulkText.trim()) return
    let grid = parsePasteText(bulkText)
    if (grid.length === 0) return
    if (bulkSkipFirstRow) grid = grid.slice(1)
    if (grid.length === 0) return
    if (bulkMode === 'replace') {
      const newRows: SizeRow[] = grid.map((line, rowIndex) => {
        const r: SizeRow = {}
        for (let j = 0; j < columns.length; j++) {
          const c = columns[j]
          if (j < line.length && line[j].length > 0) {
            r[c.key] = line[j]
          } else if (c.autoFill?.enabled) {
            r[c.key] = computeAutoValue(c.autoFill, rowIndex)
          } else {
            r[c.key] = ''
          }
        }
        return r
      })
      setRows(newRows)
    } else {
      applyGrid(rows.length, 0, grid)
    }
    setBulkText('')
    setShowBulkImport(false)
  }

  const removeRow = (rowIndex: number) => {
    setRows(rows.filter((_, i) => i !== rowIndex))
  }

  const applyTemplate = (templateId: string) => {
    if (!templateId) return
    const template = TEMPLATES.find((t) => t.id === templateId)
    if (!template) return
    const replace = isEmpty
      ? true
      : window.confirm(
          'Mevcut sütunlar şablonla değiştirilecek. Satırlar yeni şemaya uyarlanacak. Devam edilsin mi?',
        )
    if (!replace) return
    const newColumns = template.columns.map((c) => ({ ...c }))
    const allowed = new Set(newColumns.map((c) => c.key))
    const cleanedRows: SizeRow[] = rows.map((r) => {
      const out: SizeRow = {}
      for (const k of allowed) out[k] = r[k] ?? ''
      return out
    })
    onChange({ columns: newColumns, rows: cleanedRows })
  }

  return (
    <div className={styles.formGroup}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <label className={styles.formLabel} style={{ marginBottom: 0 }}>
          Ölçü / Boyut Tablosu
        </label>
        <select
          className={styles.formSelect}
          defaultValue=""
          onChange={(e) => {
            applyTemplate(e.target.value)
            e.target.value = ''
          }}
          style={{ padding: '6px 10px', fontSize: 13, height: 'auto' }}
          title="Hazır şablon uygula"
        >
          <option value="">Hazır şablonlar…</option>
          {TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sütun Yöneticisi */}
      <div
        style={{
          background: 'rgba(0,0,0,0.02)',
          border: '1px solid var(--border-color, #e5e7eb)',
          borderRadius: 10,
          padding: 12,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
            color: 'var(--text-muted)',
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
          }}
        >
          <Settings2 size={14} /> Sütun Yöneticisi
        </div>

        {isEmpty && (
          <div
            style={{
              padding: 16,
              fontSize: 13,
              color: 'var(--text-muted)',
              textAlign: 'center',
              border: '1px dashed var(--border-color, #e5e7eb)',
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            Henüz sütun yok. Hazır bir şablon seçin veya aşağıdan sütun ekleyin.
          </div>
        )}

        {!isEmpty && (
          <div className={styles.dataTable} style={{ marginBottom: 10 }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 28 }}></th>
                  <th>Anahtar (key)</th>
                  <th>Başlık (TR)</th>
                  <th>Başlık (EN)</th>
                  <th style={{ width: 80 }}>Birim</th>
                  <th style={{ width: 100 }}>Hizala</th>
                  <th style={{ width: 60 }}>Otomatik</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col, i) => {
                  const af = col.autoFill
                  const autoOn = !!af?.enabled
                  return (
                    <Fragment key={col.key}>
                      <tr>
                        <td style={{ width: 28 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <button
                              type="button"
                              onClick={() => moveColumn(i, -1)}
                              disabled={i === 0}
                              className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                              style={{ padding: 2 }}
                              aria-label="Yukarı"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveColumn(i, 1)}
                              disabled={i === columns.length - 1}
                              className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                              style={{ padding: 2 }}
                              aria-label="Aşağı"
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>
                        </td>
                        <td>
                          <ColumnKeyInput
                            value={col.key}
                            onCommit={(next) => updateColumn(i, { key: next })}
                            inputClassName={styles.formInput}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.formInput}
                            value={col.label.tr ?? ''}
                            onChange={(e) =>
                              updateColumn(i, {
                                label: { ...col.label, tr: e.target.value },
                              })
                            }
                            placeholder="Model"
                            style={{ padding: '6px 10px', fontSize: 13 }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.formInput}
                            value={col.label.en ?? ''}
                            onChange={(e) =>
                              updateColumn(i, {
                                label: { ...col.label, en: e.target.value },
                              })
                            }
                            placeholder="Model"
                            style={{ padding: '6px 10px', fontSize: 13 }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.formInput}
                            value={col.unit ?? ''}
                            onChange={(e) => updateColumn(i, { unit: e.target.value || undefined })}
                            placeholder="mm"
                            style={{ padding: '6px 10px', fontSize: 13 }}
                          />
                        </td>
                        <td>
                          <select
                            className={styles.formSelect}
                            value={col.align ?? 'left'}
                            onChange={(e) =>
                              updateColumn(i, {
                                align: e.target.value as SizeColumnAlign,
                              })
                            }
                            style={{ padding: '6px 10px', fontSize: 13, height: 'auto' }}
                          >
                            <option value="left">Sol</option>
                            <option value="center">Orta</option>
                            <option value="right">Sağ</option>
                          </select>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => toggleAutoFill(i)}
                            className={`${styles.btn} ${
                              autoOn ? styles.btnPrimary : styles.btnSecondary
                            } ${styles.btnSmall}`}
                            style={{ padding: 6 }}
                            aria-label={autoOn ? 'Otomatik kapat' : 'Otomatik aç'}
                            title={
                              autoOn
                                ? 'Otomatik model üreticisi açık'
                                : 'Bu sütun için otomatik prefix + numara üret'
                            }
                          >
                            <Hash size={14} />
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => removeColumn(i)}
                            className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                            style={{ padding: 6 }}
                            aria-label="Sütunu sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                      {autoOn && af && (
                        <tr>
                          <td colSpan={8} style={{ background: 'rgba(232, 97, 26, 0.04)' }}>
                            <div
                              style={{
                                display: 'flex',
                                gap: 12,
                                alignItems: 'flex-end',
                                flexWrap: 'wrap',
                                padding: '4px 0',
                              }}
                            >
                              <div style={{ flex: '1 1 220px' }}>
                                <label
                                  className={styles.formLabel}
                                  style={{ fontSize: 11, marginBottom: 4 }}
                                >
                                  Prefix (öne yazılacak)
                                </label>
                                <input
                                  type="text"
                                  className={styles.formInput}
                                  value={af.prefix}
                                  onChange={(e) =>
                                    updateAutoFill(i, { prefix: e.target.value })
                                  }
                                  placeholder="KRP-ST/"
                                  style={{ padding: '6px 10px', fontSize: 13, fontFamily: 'monospace' }}
                                  dir="ltr"
                                />
                              </div>
                              <div style={{ width: 110 }}>
                                <label
                                  className={styles.formLabel}
                                  style={{ fontSize: 11, marginBottom: 4 }}
                                >
                                  Hane sayısı
                                </label>
                                <select
                                  className={styles.formSelect}
                                  value={af.padding}
                                  onChange={(e) =>
                                    updateAutoFill(i, {
                                      padding: Number.parseInt(e.target.value, 10),
                                    })
                                  }
                                  style={{ padding: '6px 10px', fontSize: 13, height: 'auto' }}
                                >
                                  <option value={1}>1 (1, 2, 3…)</option>
                                  <option value={2}>2 (01, 02…)</option>
                                  <option value={3}>3 (001, 002…)</option>
                                  <option value={4}>4 (0001…)</option>
                                </select>
                              </div>
                              <div style={{ width: 90 }}>
                                <label
                                  className={styles.formLabel}
                                  style={{ fontSize: 11, marginBottom: 4 }}
                                >
                                  Başlangıç
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  className={styles.formInput}
                                  value={af.start}
                                  onChange={(e) =>
                                    updateAutoFill(i, {
                                      start: Math.max(
                                        0,
                                        Number.parseInt(e.target.value, 10) || 0,
                                      ),
                                    })
                                  }
                                  style={{ padding: '6px 10px', fontSize: 13 }}
                                />
                              </div>
                              <div style={{ flex: '1 1 100%', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: 'var(--text-muted)',
                                    flex: '1 1 220px',
                                    alignSelf: 'center',
                                  }}
                                >
                                  Önizleme:{' '}
                                  <code style={{ fontFamily: 'monospace' }}>
                                    {computeAutoValue(af, 0)}, {computeAutoValue(af, 1)}, {computeAutoValue(af, 2)}…
                                  </code>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => fillColumnAutoValues(i, false)}
                                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                                  title="Boş hücreleri sırayla doldur"
                                >
                                  <Wand2 size={13} /> Boşları Doldur
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        'Bu sütundaki TÜM hücreler otomatik üretilen değerlerle değiştirilecek. Devam edilsin mi?',
                                      )
                                    ) {
                                      fillColumnAutoValues(i, true)
                                    }
                                  }}
                                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
                                  title="Mevcut değerleri silip baştan üret"
                                >
                                  <Wand2 size={13} /> Tümünü Yenile
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <button
          type="button"
          onClick={addColumn}
          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
        >
          <Plus size={14} /> Sütun Ekle
        </button>
      </div>

      {/* Veri Izgarası */}
      {!isEmpty && (
        <>
          <div className={styles.dataTable} style={{ marginBottom: 12 }}>
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        textAlign: col.align ?? 'left',
                      }}
                    >
                      {col.label.tr || col.label.en || col.key}
                      {col.unit ? ` (${col.unit})` : ''}
                      {col.autoFill?.enabled && (
                        <Hash
                          size={11}
                          style={{ marginLeft: 4, opacity: 0.55, verticalAlign: '-1px' }}
                          aria-label="Otomatik üretim aktif"
                        />
                      )}
                    </th>
                  ))}
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={colCount + 1}
                      style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: 13,
                        padding: 14,
                      }}
                    >
                      Henüz satır yok. Aşağıdan satır ekleyin.
                    </td>
                  </tr>
                )}
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => {
                      const isAuto = !!col.autoFill?.enabled
                      const autoPlaceholder =
                        isAuto && col.autoFill
                          ? computeAutoValue(col.autoFill, rowIndex)
                          : col.label.tr || col.key
                      return (
                        <td key={col.key}>
                          <input
                            type="text"
                            className={styles.formInput}
                            value={row[col.key] ?? ''}
                            onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
                            onPaste={(e) => handleCellPaste(e, rowIndex, colIndex)}
                            placeholder={autoPlaceholder}
                            style={{
                              padding: '6px 10px',
                              fontSize: 13,
                              textAlign: col.align ?? 'left',
                              fontFamily: isAuto ? 'monospace' : undefined,
                            }}
                          />
                        </td>
                      )
                    })}
                    <td>
                      <button
                        type="button"
                        onClick={() => removeRow(rowIndex)}
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                        style={{ padding: 6 }}
                        aria-label="Satırı sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={addRow}
              className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
            >
              <Plus size={14} /> Satır Ekle
            </button>
            <button
              type="button"
              onClick={() => setShowBulkImport((s) => !s)}
              className={`${styles.btn} ${
                showBulkImport ? styles.btnPrimary : styles.btnSecondary
              } ${styles.btnSmall}`}
              title="Excel / Sheets'ten kopyaladığınız tabloyu yapıştırın"
            >
              <ClipboardPaste size={14} /> Tablo Yapıştır
            </button>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              İpucu: Bir hücreye doğrudan yapıştırırsanız (Ctrl+V) tablo o
              noktadan itibaren otomatik dağıtılır.
            </span>
          </div>

          {showBulkImport && (
            <div
              style={{
                marginTop: 12,
                background: 'rgba(0,0,0,0.02)',
                border: '1px solid var(--border-color, #e5e7eb)',
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--text-muted)',
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.4,
                  }}
                >
                  <ClipboardPaste size={14} /> Toplu İçe Aktarma
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkImport(false)}
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                  style={{ padding: 6 }}
                  aria-label="Kapat"
                >
                  <X size={14} />
                </button>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                  lineHeight: 1.55,
                }}
              >
                Excel / Google Sheets / Numbers'tan kopyaladığınız hücreleri
                buraya yapıştırın. Sütunlar TAB, virgül veya noktalı virgül ile
                ayrılabilir. Sıralama tablodaki sütun sırasıyla aynıdır
                (soldan sağa: <strong>{columns.map((c) => c.label.tr || c.key).join(' → ')}</strong>).
              </div>

              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`KRP-ST/01\t6\t7\tM3\t6\nKRP-ST/02\t8\t6\tM3\t6\n...`}
                rows={8}
                spellCheck={false}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  padding: 10,
                  border: '1px solid var(--border-color, #e5e7eb)',
                  borderRadius: 8,
                  resize: 'vertical',
                  background: 'var(--bg-primary, #fff)',
                  color: 'var(--text-primary, inherit)',
                }}
                dir="ltr"
              />

              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: 10,
                }}
              >
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="bulk-mode"
                    value="append"
                    checked={bulkMode === 'append'}
                    onChange={() => setBulkMode('append')}
                  />
                  Sona ekle
                </label>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="bulk-mode"
                    value="replace"
                    checked={bulkMode === 'replace'}
                    onChange={() => setBulkMode('replace')}
                  />
                  Tüm satırları değiştir
                </label>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={bulkSkipFirstRow}
                    onChange={(e) => setBulkSkipFirstRow(e.target.checked)}
                  />
                  İlk satır başlık (atla)
                </label>

                <div style={{ flex: 1 }} />

                <button
                  type="button"
                  onClick={() => {
                    setBulkText('')
                    setShowBulkImport(false)
                  }}
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      bulkMode === 'replace' &&
                      rows.length > 0 &&
                      !window.confirm(
                        `Mevcut ${rows.length} satır silinip yapıştırılan veriyle değiştirilecek. Devam edilsin mi?`,
                      )
                    ) {
                      return
                    }
                    applyBulkImport()
                  }}
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
                  disabled={!bulkText.trim()}
                >
                  <ClipboardPaste size={14} /> Uygula
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Boş tablo (sütunlar var ama satır yok) için ek olarak burada gösterelim ki yine yapıştırılabilsin */}
      {isEmpty && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            marginTop: 6,
          }}
        >
          Sütun ekledikten sonra Excel'den kopyaladığınız tabloyu doğrudan
          yapıştırabilirsiniz.
        </div>
      )}
    </div>
  )
}
