'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { LocalizedArrayField } from '@/types/database'
import styles from '@/app/admin/admin.module.css'
import { Label, Input, Button } from '@/components/ui'

interface ApplicationsBuilderProps {
  value: LocalizedArrayField
  onChange: (value: LocalizedArrayField) => void
}

export default function ApplicationsBuilder({ value, onChange }: ApplicationsBuilderProps) {
  const trList = value.tr ?? []
  const enList = value.en ?? []
  const maxLen = Math.max(trList.length, enList.length, 1)

  const updateLocale = (locale: 'tr' | 'en', index: number, text: string) => {
    const current = (value[locale] ?? []).slice()
    while (current.length <= index) current.push('')
    current[index] = text
    onChange({ ...value, [locale]: current })
  }

  const addRow = () => {
    onChange({
      ...value,
      tr: [...(value.tr ?? []), ''],
      en: [...(value.en ?? []), ''],
    })
  }

  const removeRow = (index: number) => {
    onChange({
      ...value,
      tr: (value.tr ?? []).filter((_, i) => i !== index),
      en: (value.en ?? []).filter((_, i) => i !== index),
    })
  }

  return (
    <div className={styles.formGroup}>
      <Label className={styles.formLabel}>Uygulama Alanları</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {Array.from({ length: maxLen }).map((_, index) => (
          <div
            key={index}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center' }}
          >
            <Input
              type="text"
              className={styles.formInput}
              placeholder="TR — ör. Mermer kesme makineleri"
              value={trList[index] ?? ''}
              onChange={(e) => updateLocale('tr', index, e.target.value)}
              style={{ fontSize: 13 }}
            />
            <Input
              type="text"
              className={styles.formInput}
              placeholder="EN — e.g. Marble cutting machines"
              value={enList[index] ?? ''}
              onChange={(e) => updateLocale('en', index, e.target.value)}
              style={{ fontSize: 13 }}
            />
            <Button
              type="button"
              onClick={() => removeRow(index)}
              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
              style={{ padding: 6 }}
              aria-label="Sil"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={addRow}
        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
      >
        <Plus size={14} /> Uygulama Ekle
      </Button>
    </div>
  )
}
