'use client'

import { Trash2, Image as ImageIcon, DraftingCompass, Briefcase } from 'lucide-react'
import type { ProductGalleryAsset, LocalizedField } from '@/types/database'
import FileUploader, { type UploadedAsset } from './FileUploader'
import styles from '@/app/admin/admin.module.css'
import { Label, Input, Button } from '@/components/ui'

interface GalleryBuilderProps {
  value: ProductGalleryAsset[]
  onChange: (assets: ProductGalleryAsset[]) => void
  productSlug?: string
}

const TYPE_LABELS: Record<NonNullable<ProductGalleryAsset['type']>, { tr: string; icon: typeof ImageIcon }> = {
  photo: { tr: 'Fotoğraf', icon: ImageIcon },
  technical: { tr: 'Teknik', icon: DraftingCompass },
  application: { tr: 'Uygulama', icon: Briefcase },
}

export default function GalleryBuilder({ value, onChange, productSlug }: GalleryBuilderProps) {
  const handleUploaded = (assets: UploadedAsset[]) => {
    const newItems: ProductGalleryAsset[] = assets.map((a) => ({
      url: a.url,
      type: 'photo',
      alt: {},
    }))
    onChange([...value, ...newItems])
  }

  const updateItem = (index: number, patch: Partial<ProductGalleryAsset>) => {
    const updated = [...value]
    updated[index] = { ...updated[index], ...patch }
    onChange(updated)
  }

  const updateAlt = (index: number, locale: 'tr' | 'en', text: string) => {
    const currentAlt: LocalizedField = value[index]?.alt ?? {}
    updateItem(index, { alt: { ...currentAlt, [locale]: text } })
  }

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const moveItem = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= value.length) return
    const updated = [...value]
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    onChange(updated)
  }

  return (
    <div className={styles.formGroup}>
      <Label className={styles.formLabel}>Görsel Galerisi</Label>

      <div style={{ marginBottom: 12 }}>
        <FileUploader
          folder="gallery"
          accept="image/png,image/jpeg,image/webp,image/avif"
          productSlug={productSlug}
          multiple
          label="Görsel Yükle (çoklu)"
          hint="PNG, JPG, WebP, AVIF • max 50 MB/dosya"
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
          Henüz görsel yok. Yukarıdan yükleyebilirsiniz.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {value.map((item, index) => {
            const t = item.type ?? 'photo'
            return (
              <div
                key={`${item.url}-${index}`}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 10,
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    aspectRatio: '4/3',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 6,
                    overflow: 'hidden',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  {(['photo', 'technical', 'application'] as const).map((opt) => {
                    const { tr, icon: Icon } = TYPE_LABELS[opt]
                    const active = t === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateItem(index, { type: opt })}
                        style={{
                          flex: 1,
                          padding: '4px 6px',
                          fontSize: 11,
                          borderRadius: 4,
                          border: '1px solid var(--border)',
                          background: active ? '#e8611a' : 'transparent',
                          color: active ? '#fff' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                        }}
                      >
                        <Icon size={11} />
                        {tr}
                      </button>
                    )
                  })}
                </div>

                <Input
                  type="text"
                  className={styles.formInput}
                  placeholder="Alt metin (TR)"
                  value={item.alt?.tr ?? ''}
                  onChange={(e) => updateAlt(index, 'tr', e.target.value)}
                  style={{ fontSize: 12 }}
                />
                <Input
                  type="text"
                  className={styles.formInput}
                  placeholder="Alt text (EN)"
                  value={item.alt?.en ?? ''}
                  onChange={(e) => updateAlt(index, 'en', e.target.value)}
                  style={{ fontSize: 12 }}
                />

                <div style={{ display: 'flex', gap: 4 }}>
                  <Button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                    style={{ flex: 1, fontSize: 11 }}
                  >
                    ↑ Yukarı
                  </Button>
                  <Button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === value.length - 1}
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                    style={{ flex: 1, fontSize: 11 }}
                  >
                    ↓ Aşağı
                  </Button>
                  <Button
                    type="button"
                    onClick={() => removeItem(index)}
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                    style={{ padding: 6 }}
                    aria-label="Sil"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
