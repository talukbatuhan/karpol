'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { SizeTableBlock } from '@/types/database'
import styles from '@/app/admin/admin.module.css'
import { Input, Label } from '@/components/ui'
import SizeTableBuilder from '@/components/admin/SizeTableBuilder'

type Props = {
  value: SizeTableBlock[]
  onChange: (next: SizeTableBlock[]) => void
}

const EMPTY_TABLE = { columns: [], rows: [] }

function makeBlock(index: number): SizeTableBlock {
  return {
    id: `table-${Date.now()}-${index}`,
    title: { tr: `Ölçü Tablosu ${index + 1}`, en: `Size Table ${index + 1}` },
    table: EMPTY_TABLE,
  }
}

export default function MultiSizeTableBuilder({ value, onChange }: Props) {
  const blocks = value.length > 0 ? value : [makeBlock(0)]

  const updateBlock = (idx: number, patch: Partial<SizeTableBlock>) => {
    const next = [...blocks]
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }

  const addBlock = () => onChange([...blocks, makeBlock(blocks.length)])
  const removeBlock = (idx: number) => onChange(blocks.filter((_, i) => i !== idx))

  return (
    <div className={styles.formGroup}>
      {blocks.map((block, index) => (
        <div
          key={block.id}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'end', marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <Label className={styles.formLabel}>Tablo Başlığı (TR)</Label>
              <Input
                type="text"
                className={styles.formInput}
                value={block.title?.tr ?? ''}
                onChange={(e) =>
                  updateBlock(index, { title: { ...(block.title ?? {}), tr: e.target.value } })
                }
                placeholder={`Ölçü Tablosu ${index + 1}`}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label className={styles.formLabel}>Table Title (EN)</Label>
              <Input
                type="text"
                className={styles.formInput}
                value={block.title?.en ?? ''}
                onChange={(e) =>
                  updateBlock(index, { title: { ...(block.title ?? {}), en: e.target.value } })
                }
                placeholder={`Size Table ${index + 1}`}
              />
            </div>
            {blocks.length > 1 && (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                onClick={() => removeBlock(index)}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <SizeTableBuilder
            value={block.table}
            onChange={(table) => updateBlock(index, { table })}
          />
        </div>
      ))}

      <button type="button" onClick={addBlock} className={`${styles.btn} ${styles.btnSecondary}`}>
        <Plus size={14} /> Yeni Ölçü Tablosu Ekle
      </button>
    </div>
  )
}
