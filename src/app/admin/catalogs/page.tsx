'use client'

import { useEffect, useMemo, useState } from 'react'
import { Save, RefreshCw, Upload } from 'lucide-react'
import styles from '../admin.module.css'

type CatalogPageAsset = {
  index: number
  pageNumber: number
  url: string | null
  thumbUrl: string | null
}

type CatalogManifest = {
  schemaVersion: number
  catalogId: string
  title?: string
  totalPages: number
  pages: CatalogPageAsset[]
}

export default function AdminCatalogsPage() {
  const [catalogs, setCatalogs] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('main')
  const [title, setTitle] = useState('')
  const [rows, setRows] = useState('[]')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const totalPages = useMemo(() => {
    try {
      const parsed = JSON.parse(rows) as CatalogPageAsset[]
      return Array.isArray(parsed) ? parsed.length : 0
    } catch {
      return 0
    }
  }, [rows])

  useEffect(() => {
    const loadCatalogs = async () => {
      const res = await fetch('/api/admin/catalogs')
      if (!res.ok) return
      const data = await res.json()
      setCatalogs(data.catalogs ?? [])
      if (data.catalogs?.length && !data.catalogs.includes(selected)) {
        setSelected(data.catalogs[0])
      }
    }
    void loadCatalogs()
  }, [selected])

  const loadManifest = async (catalogId: string) => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`/api/admin/catalogs/${catalogId}`)
      if (!res.ok) throw new Error('Failed to load manifest')
      const data = (await res.json()) as CatalogManifest
      setTitle(data.title ?? '')
      setRows(JSON.stringify(data.pages ?? [], null, 2))
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to load manifest')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selected) void loadManifest(selected)
  }, [selected])

  const saveManifest = async () => {
    setSaving(true)
    setMessage('')
    try {
      const pages = JSON.parse(rows) as CatalogPageAsset[]
      const payload: CatalogManifest = {
        schemaVersion: 1,
        catalogId: selected,
        title: title || undefined,
        totalPages: pages.length,
        pages,
      }
      const res = await fetch('/api/admin/catalogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Manifest kaydedilemedi')
      setMessage('Manifest kaydedildi.')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Kaydetme hatası')
    } finally {
      setSaving(false)
    }
  }

  const uploadCatalogFiles = async (target: 'pages' | 'thumbs', files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setMessage('')
    try {
      const sorted = Array.from(files).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      for (const file of sorted) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('bucket', 'catalogs')
        fd.append('folder', `${selected}/${target}`)
        fd.append('keepOriginalName', 'true')
        fd.append('overwrite', 'true')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) throw new Error(`${target} upload failed: ${file.name}`)
      }
      const rebuildRes = await fetch('/api/admin/catalogs/rebuild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalogId: selected, title: title || undefined }),
      })
      if (!rebuildRes.ok) throw new Error('Manifest rebuild failed after upload')
      const rebuildData = await rebuildRes.json()
      const rebuilt = rebuildData?.manifest as CatalogManifest | undefined
      if (rebuilt) {
        setTitle(rebuilt.title ?? '')
        setRows(JSON.stringify(rebuilt.pages ?? [], null, 2))
      } else {
        await loadManifest(selected)
      }
      setMessage(`${target} files uploaded and manifest rebuilt successfully.`)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Catalogs</h1>
        </div>
        <div className={styles.topBarRight}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => selected && void loadManifest(selected)}>
            <RefreshCw size={16} /> Reload
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={saveManifest} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Manifest'}
          </button>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
          <div className={styles.statCard}>
            <label className={styles.formLabel}>Select Catalog</label>
            <select
              className={styles.formSelect}
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {catalogs.length === 0 && <option value="main">main</option>}
              {catalogs.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>

            <div className={styles.formGroup} style={{ marginTop: 16 }}>
              <label className={styles.formLabel}>Catalog Title</label>
              <input
                className={styles.formInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="KARPOL 2026 Main Catalog"
              />
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Toplam sayfa: <b>{totalPages}</b>
            </div>

            <div className={styles.formGroup} style={{ marginTop: 16 }}>
              <label className={styles.formLabel}>Upload Page Images</label>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => void uploadCatalogFiles('pages', e.target.files)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Upload Thumbnails (optional)</label>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => void uploadCatalogFiles('thumbs', e.target.files)}
              />
            </div>

            {uploading && (
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                <Upload size={14} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
                Uploading files...
              </div>
            )}
            {message && (
              <div style={{ marginTop: 12, fontSize: 13, color: '#0f766e' }}>{message}</div>
            )}
          </div>

          <div className={styles.statCard}>
            <label className={styles.formLabel}>Manifest Pages JSON</label>
            <textarea
              className={styles.formTextarea}
              style={{ minHeight: 520, fontFamily: 'var(--font-mono)' }}
              value={rows}
              onChange={(e) => setRows(e.target.value)}
            />
            {loading && <p style={{ marginTop: 8, color: 'var(--text-muted)' }}>Yukleniyor...</p>}
          </div>
        </div>
      </div>
    </>
  )
}
