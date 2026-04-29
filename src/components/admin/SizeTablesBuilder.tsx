'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { LocalizedField, SizeTableBlock } from '@/types/database'
import { EMPTY_SIZE_TABLE } from '@/types/database'
import I18nFieldEditor from '@/components/admin/I18nFieldEditor'
import SizeTableBuilder from '@/components/admin/SizeTableBuilder'
import styles from '@/app/admin/admin.module.css'
import { Label, Button } from '@/components/ui'

interface SizeTablesBuilderProps {
  value: SizeTableBlock[]
  onChange: (tables: SizeTableBlock[]) => void
}

export default function SizeTablesBuilder({ value, onChange }: SizeTablesBuilderProps) {
  const addTable = () => {
    onChange([...value, { ...EMPTY_SIZE_TABLE, title: {} }])
  }

  const removeTable = (index: number) => {
    if (value.length <= 1) {
      onChange([{ ...EMPTY_SIZE_TABLE }])
      return
    }
    onChange(value.filter((_, i) => i !== index))
  }

  const updateTitle = (index: number, title: LocalizedField) => {
    const next = [...value]
    next[index] = { ...next[index], title }
    onChange(next)
  }

  const updateTable = (index: number, table: SizeTableBlock) => {
    const next = [...value]
    const prevTitle = next[index].title
    next[index] = { ...table, ...(prevTitle !== undefined ? { title: prevTitle } : {}) }
    onChange(next)
  }

  return (
    <div className={styles.formGroup}>
      <Label className={styles.formLabel}>Ölçü / Boyut Tabloları</Label>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-muted)' }}>
        Birden fazla ölçü matrisi ekleyebilirsiniz (ör. rulman serisi, takoz seti). Her blok için
        isteğe bağlı başlık ve kendi sütun/satır şemanızı tanımlayın.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {value.map((block, index) => (
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
              value={block.title ?? {}}
              onChange={(t) => updateTitle(index, t)}
            />

            <SizeTableBuilder
              embedded
              value={{ columns: block.columns, rows: block.rows }}
              onChange={(next) => updateTable(index, { ...next, title: block.title })}
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
        <Plus size={14} /> Yeni ölçü tablosu ekle
      </Button>
    </div>
  )
}
