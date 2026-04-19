'use client'

import { useRef, useState } from 'react'
import { Upload, Loader2, X } from 'lucide-react'
import styles from '@/app/admin/admin.module.css'

export type UploadFolder = 'gallery' | 'drawings' | 'models' | 'datasheets' | 'hero' | 'misc'

export interface UploadedAsset {
  url: string
  path: string
  name: string
  size: number
  type: string
}

interface FileUploaderProps {
  folder: UploadFolder
  accept?: string
  productSlug?: string
  multiple?: boolean
  label?: string
  hint?: string
  onUploaded: (assets: UploadedAsset[]) => void
  disabled?: boolean
}

export default function FileUploader({
  folder,
  accept,
  productSlug,
  multiple = false,
  label = 'Dosya Yükle',
  hint,
  onUploaded,
  disabled,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>('')

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError('')
    setUploading(true)
    setProgress(0)

    const uploaded: UploadedAsset[] = []
    const list = Array.from(files)

    try {
      for (let i = 0; i < list.length; i++) {
        const file = list[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)
        if (productSlug) formData.append('productSlug', productSlug)

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: 'Yükleme hatası' }))
          throw new Error(body.error || 'Yükleme hatası')
        }

        const asset = (await res.json()) as UploadedAsset
        uploaded.push(asset)
        setProgress(Math.round(((i + 1) / list.length) * 100))
      }

      onUploaded(uploaded)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yükleme hatası')
    } finally {
      setUploading(false)
      setProgress(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled || uploading}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className={`${styles.btn} ${styles.btnSecondary}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        {uploading ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
        {uploading ? `Yükleniyor ${progress}%` : label}
      </button>

      {hint && !uploading && !error && (
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>{hint}</div>
      )}

      {error && (
        <div
          style={{
            marginTop: 8,
            padding: '8px 12px',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: 6,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <X size={14} /> {error}
        </div>
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
