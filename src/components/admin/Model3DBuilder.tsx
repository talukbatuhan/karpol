'use client'

import { Box, Trash2, FileText } from 'lucide-react'
import type { ProductModel3D } from '@/types/database'
import FileUploader, { type UploadedAsset } from './FileUploader'
import styles from '@/app/admin/admin.module.css'

interface Model3DBuilderProps {
  value: ProductModel3D
  onChange: (model: ProductModel3D) => void
  productSlug?: string
}

export default function Model3DBuilder({ value, onChange, productSlug }: Model3DBuilderProps) {
  const setGlb = (assets: UploadedAsset[]) => {
    if (assets[0]) onChange({ ...value, glb_url: assets[0].url })
  }
  const setStp = (assets: UploadedAsset[]) => {
    if (assets[0]) onChange({ ...value, stp_url: assets[0].url })
  }
  const setPreview = (assets: UploadedAsset[]) => {
    if (assets[0]) onChange({ ...value, preview_image_url: assets[0].url })
  }

  const clear = (key: keyof ProductModel3D) => {
    const next = { ...value }
    delete next[key]
    onChange(next)
  }

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>3D Model</label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 12,
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 14,
          background: 'var(--bg-surface)',
        }}
      >
        <Slot
          title="GLB Dosyası (tarayıcıda görüntüleme)"
          hint="Web üzerinde 3D viewer için. GLB uzantılı dosya yükleyin."
          icon={<Box size={16} />}
          url={value.glb_url}
          onClear={() => clear('glb_url')}
          uploader={
            <FileUploader
              folder="models"
              accept=".glb,model/gltf-binary"
              productSlug={productSlug}
              label="GLB Yükle"
              onUploaded={setGlb}
            />
          }
        />

        <Slot
          title="STP/STEP Dosyası (müşteri indirmesi için)"
          hint="CAD veri alışverişi. Ziyaretçiler indirebilir."
          icon={<FileText size={16} />}
          url={value.stp_url}
          onClear={() => clear('stp_url')}
          uploader={
            <FileUploader
              folder="models"
              accept=".stp,.step,application/step"
              productSlug={productSlug}
              label="STP/STEP Yükle"
              onUploaded={setStp}
            />
          }
        />

        <Slot
          title="Önizleme Görseli (opsiyonel)"
          hint="3D model yüklenmeden önce gösterilecek kapak görseli."
          icon={<Box size={16} />}
          url={value.preview_image_url}
          onClear={() => clear('preview_image_url')}
          isImage
          uploader={
            <FileUploader
              folder="models"
              accept="image/png,image/jpeg,image/webp"
              productSlug={productSlug}
              label="Görsel Yükle"
              onUploaded={setPreview}
            />
          }
        />
      </div>
    </div>
  )
}

function Slot({
  title,
  hint,
  icon,
  url,
  onClear,
  uploader,
  isImage,
}: {
  title: string
  hint: string
  icon: React.ReactNode
  url?: string
  onClear: () => void
  uploader: React.ReactNode
  isImage?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</div>
      {url ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 8,
            border: '1px solid var(--border)',
            borderRadius: 6,
            background: 'var(--bg-tertiary)',
          }}
        >
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 4 }} />
          ) : null}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)', wordBreak: 'break-all' }}
          >
            {url.split('/').pop()}
          </a>
          <button
            type="button"
            onClick={onClear}
            className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
            aria-label="Sil"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ) : (
        uploader
      )}
    </div>
  )
}
