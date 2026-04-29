'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import type { ProductCategory } from '@/types/database'
import { getLocalizedField } from '@/lib/i18n-helpers'
import FileUploader, { type UploadedAsset } from '@/components/admin/FileUploader'
import styles from '@/app/admin/admin.module.css'

type Props = {
  initialCategories: ProductCategory[]
}

function extractStoragePathFromPublicUrl(url?: string): string | null {
  if (!url) return null
  const marker = '/storage/v1/object/public/product-assets/'
  const idx = url.indexOf(marker)
  if (idx < 0) return null
  return decodeURIComponent(url.slice(idx + marker.length))
}

export default function CategoryBannerManager({ initialCategories }: Props) {
  const [rows, setRows] = useState(initialCategories)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string>('')

  const updateCategoryImage = async (categoryId: string, imageUrl: string | null) => {
    const res = await fetch(`/api/admin/categories/${categoryId}/image`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'İşlem başarısız' }))
      throw new Error(body.error || 'İşlem başarısız')
    }
  }

  const onUploaded = async (categoryId: string, assets: UploadedAsset[]) => {
    const asset = assets[0]
    if (!asset) return
    setError('')
    setBusyId(categoryId)
    try {
      await updateCategoryImage(categoryId, asset.url)
      setRows((prev) => prev.map((row) => (row.id === categoryId ? { ...row, image_url: asset.url } : row)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Banner güncellenemedi')
    } finally {
      setBusyId(null)
    }
  }

  const onRemoveImage = async (categoryId: string, currentUrl?: string) => {
    setError('')
    setBusyId(categoryId)
    try {
      const path = extractStoragePathFromPublicUrl(currentUrl)
      if (path) {
        await fetch(`/api/admin/upload?path=${encodeURIComponent(path)}`, { method: 'DELETE' })
      }
      await updateCategoryImage(categoryId, null)
      setRows((prev) => prev.map((row) => (row.id === categoryId ? { ...row, image_url: undefined } : row)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Banner silinemedi')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className={styles.dataTable}>
      {error && (
        <div style={{ marginBottom: 12, color: '#b91c1c', background: '#fee2e2', borderRadius: 8, padding: '8px 12px' }}>
          {error}
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Slug</th>
            <th>Banner Görseli</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((category) => (
            <tr key={category.id}>
              <td>
                <Link href={`/admin/categories/${category.id}`} style={{ color: '#e8611a', fontWeight: 600 }}>
                  {getLocalizedField(category.name, 'tr') || getLocalizedField(category.name, 'en')}
                </Link>
              </td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{category.slug}</td>
              <td>
                <div
                  style={{
                    width: 180,
                    height: 92,
                    borderRadius: 10,
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    background: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    fontSize: 12,
                  }}
                >
                  {category.image_url ? (
                    <Image src={category.image_url} alt={category.slug} width={180} height={92} style={{ objectFit: 'cover' }} />
                  ) : (
                    'Görsel yok'
                  )}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <FileUploader
                    folder="hero"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    productSlug={category.slug}
                    label={busyId === category.id ? 'Kaydediliyor...' : 'Yükle ve Seç'}
                    hint="PNG/JPG/WEBP/AVIF"
                    onUploaded={(assets) => onUploaded(category.id, assets)}
                    disabled={busyId === category.id}
                  />
                  {category.image_url && (
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => onRemoveImage(category.id, category.image_url)}
                      disabled={busyId === category.id}
                    >
                      <Trash2 size={14} /> Kaldır
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
