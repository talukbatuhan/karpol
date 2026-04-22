'use client'

import { Trash2, FileText } from 'lucide-react'
import type { ProductTechnicalDrawing, LocalizedField } from '@/types/database'
import FileUploader, { type UploadedAsset } from './FileUploader'
import styles from '@/app/admin/admin.module.css'
import { Label, Input, Button } from '@/components/ui'

interface TechnicalDrawingBuilderProps {
  value: ProductTechnicalDrawing[]
  onChange: (drawings: ProductTechnicalDrawing[]) => void
  productSlug?: string
}

function isImage(url: string) {
  return /\.(png|jpe?g|webp|avif)$/i.test(url)
}

export default function TechnicalDrawingBuilder({
  value,
  onChange,
  productSlug,
}: TechnicalDrawingBuilderProps) {
  const handleUploaded = (assets: UploadedAsset[]) => {
    const newItems: ProductTechnicalDrawing[] = assets.map((a) => ({
      url: a.url,
      caption: {},
    }))
    onChange([...value, ...newItems])
  }

  const updateCaption = (index: number, locale: 'tr' | 'en', text: string) => {
    const updated = [...value]
    const currentCaption: LocalizedField = updated[index]?.caption ?? {}
    updated[index] = { ...updated[index], caption: { ...currentCaption, [locale]: text } }
    onChange(updated)
  }

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.formGroup}>
      <Label className={styles.formLabel}>Teknik Resimler</Label>

      <div style={{ marginBottom: 12 }}>
        <FileUploader
          folder="drawings"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          productSlug={productSlug}
          multiple
          label="Teknik Resim Yükle"
          hint="PNG, JPG, WebP veya PDF • max 50 MB"
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
          Henüz teknik resim yok.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {value.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: 12,
                alignItems: 'center',
                padding: 10,
                border: '1px solid var(--border)',
                borderRadius: 8,
                background: 'var(--bg-surface)',
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: 'var(--bg-tertiary)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isImage(item.url) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <FileText size={28} color="var(--text-muted)" />
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, color: 'var(--text-muted)' }}
                >
                  {item.url.split('/').pop()}
                </a>
                <Input
                  type="text"
                  className={styles.formInput}
                  placeholder="Başlık (TR) — ör. Genel Montaj Görünümü"
                  value={item.caption?.tr ?? ''}
                  onChange={(e) => updateCaption(index, 'tr', e.target.value)}
                  style={{ fontSize: 13 }}
                />
                <Input
                  type="text"
                  className={styles.formInput}
                  placeholder="Caption (EN)"
                  value={item.caption?.en ?? ''}
                  onChange={(e) => updateCaption(index, 'en', e.target.value)}
                  style={{ fontSize: 13 }}
                />
              </div>

              <Button
                type="button"
                onClick={() => removeItem(index)}
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                aria-label="Sil"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
