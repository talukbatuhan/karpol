'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { LocalizedField, ProductSpecificationTable } from '@/types/database'
import I18nFieldEditor from '@/components/admin/I18nFieldEditor'
import SpecificationBuilder from '@/components/admin/SpecificationBuilder'
import styles from '@/app/admin/admin.module.css'
import { Label, Button } from '@/components/ui'

interface SpecificationTablesBuilderProps {
  value: ProductSpecificationTable[]
  onChange: (tables: ProductSpecificationTable[]) => void
}

export default function SpecificationTablesBuilder({
  value,
  onChange,
}: SpecificationTablesBuilderProps) {
  const addTable = () => {
    onChange([...value, { title: {}, rows: [] }])
  }

  const removeTable = (index: number) => {
    if (value.length <= 1) {
      onChange([{ title: {}, rows: [] }])
      return
    }
    onChange(value.filter((_, i) => i !== index))
  }

  const updateTitle = (index: number, title: LocalizedField) => {
    const next = [...value]
    next[index] = { ...next[index], title }
    onChange(next)
  }

  const updateRows = (index: number, rows: ProductSpecificationTable['rows']) => {
    const next = [...value]
    next[index] = { ...next[index], rows }
    onChange(next)
  }

  return (
    <div className={styles.formGroup}>
      <Label className={styles.formLabel}>Teknik Özellik Tabloları</Label>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-muted)' }}>
        Birden fazla tablo ekleyebilirsiniz (ör. mekanik özellikler, kimyasal direnç). Her tablo için
        isteğe bağlı başlık ve satırları doldurun.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {value.map((table, index) => (
          <div
            key={index}
            style={{
              border: '1px solid rgba(15, 23, 41, 0.12)',
              borderRadius: 10,
              padding: 16,
              background: 'rgba(244, 241, 234, 0.35)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
                gap: 12,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em' }}>
                TABLO {index + 1}
              </span>
              <Button
                type="button"
                onClick={() => removeTable(index)}
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                style={{ padding: '6px 10px' }}
              >
                <Trash2 size={14} /> Tabloyu kaldır
              </Button>
            </div>

            <I18nFieldEditor
              label="Tablo başlığı (isteğe bağlı)"
              value={table.title ?? {}}
              onChange={(t) => updateTitle(index, t)}
            />

            <SpecificationBuilder
              embedded
              value={table.rows}
              onChange={(rows) => updateRows(index, rows)}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={addTable}
        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
        style={{ marginTop: 16 }}
      >
        <Plus size={14} /> Yeni tablo ekle
      </Button>
    </div>
  )
}
