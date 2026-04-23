'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { LocalizedArrayField, SupportedLocale } from '@/types/database'
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@/lib/i18n-helpers'
import styles from '@/app/admin/admin.module.css'
import { Label, Input, Button } from '@/components/ui'

interface ApplicationsBuilderProps {
  value: LocalizedArrayField
  onChange: (value: LocalizedArrayField) => void
}

const PLACEHOLDER: Record<SupportedLocale, string> = {
  tr: 'TR — ör. Mermer kesme makineleri',
  en: 'EN — e.g. Marble cutting machines',
}

export default function ApplicationsBuilder({ value, onChange }: ApplicationsBuilderProps) {
  const lists = SUPPORTED_LOCALES.map((loc) => value[loc] ?? [])
  const maxLen = Math.max(1, ...lists.map((l) => l.length))

  const updateLocale = (locale: SupportedLocale, index: number, text: string) => {
    const current = (value[locale] ?? []).slice()
    while (current.length <= index) current.push('')
    current[index] = text
    onChange({ ...value, [locale]: current })
  }

  const addRow = () => {
    const next = { ...value }
    for (const loc of SUPPORTED_LOCALES) {
      next[loc] = [...(value[loc] ?? []), '']
    }
    onChange(next)
  }

  const removeRow = (index: number) => {
    const next = { ...value }
    for (const loc of SUPPORTED_LOCALES) {
      next[loc] = (value[loc] ?? []).filter((_, i) => i !== index)
    }
    onChange(next)
  }

  return (
    <div className={styles.formGroup}>
      <Label className={styles.formLabel}>Uygulama Alanları</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {Array.from({ length: maxLen }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${SUPPORTED_LOCALES.length}, minmax(0,1fr)) auto`,
              gap: 8,
              alignItems: 'center',
            }}
          >
            {SUPPORTED_LOCALES.map((loc) => {
              const list = value[loc] ?? []
              return (
                <div key={loc} style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: 'var(--text-muted)',
                      marginBottom: 2,
                    }}
                  >
                    {LOCALE_LABELS[loc]}
                  </div>
                  <Input
                    type="text"
                    className={styles.formInput}
                    placeholder={PLACEHOLDER[loc]}
                    value={list[index] ?? ''}
                    onChange={(e) => updateLocale(loc, index, e.target.value)}
                    style={{ fontSize: 12 }}
                  />
                </div>
              )
            })}
            <Button
              type="button"
              onClick={() => removeRow(index)}
              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
              style={{ padding: 6, alignSelf: 'end' }}
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
