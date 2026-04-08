'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import I18nFieldEditor from '@/components/admin/I18nFieldEditor'
import SpecificationBuilder from '@/components/admin/SpecificationBuilder'
import { saveProduct } from '@/lib/actions/admin-product-actions'
import type { LocalizedField, ProductSpecification } from '@/types/database'
import styles from '../../admin.module.css'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState<LocalizedField>({})
  const [description, setDescription] = useState<LocalizedField>({})
  const [shortDescription, setShortDescription] = useState<LocalizedField>({})
  const [slug, setSlug] = useState('')
  const [sku, setSku] = useState('')
  const [material, setMaterial] = useState('')
  const [hardness, setHardness] = useState('')
  const [hardnessUnit, setHardnessUnit] = useState('Shore A')
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([])
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const result = await saveProduct({
      name,
      description,
      short_description: shortDescription,
      slug,
      sku,
      material,
      hardness,
      hardness_unit: hardnessUnit,
      specifications,
      is_active: isActive,
      is_featured: isFeatured,
      images: [],
      compatible_machines: [],
      sort_order: 0,
    })

    if (result.error) {
      setError(result.error)
      setSaving(false)
    } else {
      router.push('/admin/products')
    }
  }

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/admin/products" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.topBarTitle}>New Product</h1>
        </div>
        <div className={styles.topBarRight}>
          <button
            type="submit"
            form="product-form"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className={styles.pageContent}>
        {error && (
          <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form id="product-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
            <div>
              <I18nFieldEditor label="Product Name" value={name} onChange={setName} required />
              <I18nFieldEditor label="Short Description" value={shortDescription} onChange={setShortDescription} />
              <I18nFieldEditor label="Full Description" value={description} onChange={setDescription} multiline />
              <SpecificationBuilder value={specifications} onChange={setSpecifications} />
            </div>

            <div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slug <span style={{ color: '#e8611a' }}>*</span></label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="polyurethane-roller-80mm"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>SKU <span style={{ color: '#e8611a' }}>*</span></label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="PU-RLR-080"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Material</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Polyurethane"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Hardness</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={hardness}
                    onChange={(e) => setHardness(e.target.value)}
                    placeholder="95"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Unit</label>
                  <select
                    className={styles.formSelect}
                    value={hardnessUnit}
                    onChange={(e) => setHardnessUnit(e.target.value)}
                  >
                    <option value="Shore A">Shore A</option>
                    <option value="Shore D">Shore D</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>Active (visible on site)</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>Featured product</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
