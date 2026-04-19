'use client'

import { useState } from 'react'
import { Trash2, Star, ChevronUp, ChevronDown, Plus } from 'lucide-react'
import FileUploader, { type UploadedAsset } from './FileUploader'
import styles from '@/app/admin/admin.module.css'

interface ProductCoverImagesBuilderProps {
  value: string[]
  onChange: (urls: string[]) => void
  productSlug?: string
}

export default function ProductCoverImagesBuilder({
  value,
  onChange,
  productSlug,
}: ProductCoverImagesBuilderProps) {
  const [manualUrl, setManualUrl] = useState('')

  const handleUploaded = (assets: UploadedAsset[]) => {
    const urls = assets.map((a) => a.url).filter(Boolean)
    onChange([...value, ...urls])
  }

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const setAsCover = (index: number) => {
    if (index === 0) return
    const next = [...value]
    const [picked] = next.splice(index, 1)
    next.unshift(picked)
    onChange(next)
  }

  const addManual = () => {
    const trimmed = manualUrl.trim()
    if (!trimmed) return
    onChange([...value, trimmed])
    setManualUrl('')
  }

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Kart Görselleri</label>
      <div style={{ marginBottom: 8, fontSize: 11, color: 'var(--text-muted)' }}>
        İlk görsel kategori sayfasındaki kapak (kart) görseli olarak kullanılır. Sürükle &
        bırak yerine yukarı/aşağı oklar veya yıldız simgesi ile sıralayabilirsiniz.
      </div>

      <div style={{ marginBottom: 12 }}>
        <FileUploader
          folder="gallery"
          accept="image/png,image/jpeg,image/webp,image/avif"
          productSlug={productSlug}
          multiple
          label="Kapak Görseli Yükle (çoklu)"
          hint="PNG, JPG, WebP, AVIF • max 50 MB/dosya"
          onUploaded={handleUploaded}
        />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <input
          type="url"
          className={styles.formInput}
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="veya görsel URL'i yapıştır"
          style={{ flex: 1, fontSize: 12 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addManual()
            }
          }}
        />
        <button
          type="button"
          onClick={addManual}
          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          <Plus size={12} /> Ekle
        </button>
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
          Henüz kart görseli yok. Yükleyin veya URL ekleyin.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 10,
          }}
        >
          {value.map((url, index) => {
            const isCover = index === 0
            return (
              <div
                key={`${url}-${index}`}
                style={{
                  border: isCover
                    ? '2px solid #c8a85a'
                    : '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 8,
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  position: 'relative',
                }}
              >
                {isCover && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      background: '#c8a85a',
                      color: '#0F1729',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 4,
                      letterSpacing: '0.04em',
                      zIndex: 2,
                    }}
                  >
                    KAPAK
                  </div>
                )}
                <div
                  style={{
                    aspectRatio: '4/3',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 6,
                    overflow: 'hidden',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={url}
                >
                  {url}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => setAsCover(index)}
                    disabled={isCover}
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                    style={{
                      flex: 1,
                      padding: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      fontSize: 10,
                    }}
                    title="Kapak yap"
                  >
                    <Star size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                    style={{ flex: 1, padding: 4 }}
                    title="Yukarı"
                  >
                    <ChevronUp size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                    style={{ flex: 1, padding: 4 }}
                    title="Aşağı"
                  >
                    <ChevronDown size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                    style={{ flex: 1, padding: 4 }}
                    title="Sil"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
