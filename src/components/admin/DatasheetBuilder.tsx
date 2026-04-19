'use client'

import { Trash2, FileText } from 'lucide-react'
import type { ProductDatasheet, LocalizedField } from '@/types/database'
import FileUploader, { type UploadedAsset } from './FileUploader'
import styles from '@/app/admin/admin.module.css'

interface DatasheetBuilderProps {
  value: ProductDatasheet[]
  onChange: (sheets: ProductDatasheet[]) => void
  productSlug?: string
}

export default function DatasheetBuilder({ value, onChange, productSlug }: DatasheetBuilderProps) {
  const handleUploaded = (assets: UploadedAsset[]) => {
    const newItems: ProductDatasheet[] = assets.map((a) => ({
      url: a.url,
      label: {},
    }))
    onChange([...value, ...newItems])
  }

  const updateLabel = (index: number, locale: 'tr' | 'en', text: string) => {
    const updated = [...value]
    const currentLabel: LocalizedField = updated[index]?.label ?? {}
    updated[index] = { ...updated[index], label: { ...currentLabel, [locale]: text } }
    onChange(updated)
  }

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Datasheet / Teknik Doküman (PDF)</label>

      <div style={{ marginBottom: 12 }}>
        <FileUploader
          folder="datasheets"
          accept="application/pdf"
          productSlug={productSlug}
          multiple
          label="PDF Yükle"
          hint="Sadece PDF • max 50 MB"
          onUploaded={handleUploaded}
        />
      </div>

      {value.length === 0 ? (
        <div
          style={{
            padding: 24,
            border: '1px dashed var(--border)',
            borderRadius: 8,
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          Henüz datasheet yok.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {value.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr auto',
                gap: 12,
                alignItems: 'center',
                padding: 10,
                border: '1px solid var(--border)',
                borderRadius: 8,
                background: 'var(--bg-surface)',
              }}
            >
              <FileText size={28} color="var(--text-muted)" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, color: 'var(--text-muted)' }}
                >
                  {item.url.split('/').pop()}
                </a>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Görünen ad (TR) — ör. Teknik Datasheet"
                  value={item.label?.tr ?? ''}
                  onChange={(e) => updateLabel(index, 'tr', e.target.value)}
                  style={{ fontSize: 13 }}
                />
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Label (EN)"
                  value={item.label?.en ?? ''}
                  onChange={(e) => updateLabel(index, 'en', e.target.value)}
                  style={{ fontSize: 13 }}
                />
              </div>

              <button
                type="button"
                onClick={() => removeItem(index)}
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                aria-label="Sil"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
