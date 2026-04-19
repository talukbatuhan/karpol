'use client'

import { useState } from 'react'
import { Wand2, Loader2 } from 'lucide-react'
import styles from '@/app/admin/admin.module.css'

interface SkuInputProps {
  value: string
  onChange: (value: string) => void
  categoryId: string
  required?: boolean
  brand?: string
  padding?: number
}

export default function SkuInput({
  value,
  onChange,
  categoryId,
  required = false,
  brand = 'KRP',
  padding = 3,
}: SkuInputProps) {
  const [generating, setGenerating] = useState(false)
  const [hint, setHint] = useState<string | null>(null)
  const [hintType, setHintType] = useState<'info' | 'error'>('info')

  const showHint = (msg: string, type: 'info' | 'error' = 'info') => {
    setHint(msg)
    setHintType(type)
    if (type === 'info') {
      window.setTimeout(() => setHint(null), 3500)
    }
  }

  const handleGenerate = async () => {
    if (!categoryId) {
      showHint('Önce kategori seçin.', 'error')
      return
    }
    setGenerating(true)
    setHint(null)
    try {
      const params = new URLSearchParams({
        categoryId,
        brand,
        padding: String(padding),
      })
      const res = await fetch(`/api/admin/products/next-sku?${params}`)
      const data = await res.json()
      if (!res.ok || !data.sku) {
        showHint(data.error || 'SKU üretilemedi.', 'error')
        return
      }
      onChange(data.sku)
      showHint(`Önerilen: ${data.sku} (sıra #${data.nextNumber})`, 'info')
    } catch {
      showHint('Bağlantı hatası, tekrar deneyin.', 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className={styles.formGroup}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <label className={styles.formLabel} style={{ marginBottom: 0 }}>
          SKU{' '}
          {required && <span style={{ color: '#e8611a' }}>*</span>}
        </label>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !categoryId}
          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
          title={categoryId ? 'Kategori prefix\'inden otomatik üret' : 'Önce kategori seçin'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          {generating ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
          Otomatik Üret
        </button>
      </div>
      <input
        type="text"
        className={styles.formInput}
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder={`${brand}-RB-${'0'.repeat(padding - 1)}1`}
        required={required}
        dir="ltr"
      />
      {hint && (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: hintType === 'error' ? '#dc2626' : 'var(--text-muted)',
          }}
        >
          {hint}
        </div>
      )}
      {!hint && (
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
          Şablon: <code>{brand}-{'{prefix}'}-{'#'.repeat(padding)}</code>. İstediğiniz formatta elle de yazabilirsiniz.
        </div>
      )}
      <style jsx>{`
        .spin {
          animation: spin 0.8s linear infinite;
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
