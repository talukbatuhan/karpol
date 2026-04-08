'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import I18nFieldEditor from '@/components/admin/I18nFieldEditor'
import SpecificationBuilder from '@/components/admin/SpecificationBuilder'
import { saveProduct, removeProduct } from '@/lib/actions/admin-product-actions'
import type { LocalizedField, ProductSpecification, Product } from '@/types/database'
import styles from '../../admin.module.css'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [productId, setProductId] = useState('')

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

  useEffect(() => {
    params.then(async ({ id }) => {
      setProductId(id)
      try {
        const res = await fetch(`/api/admin/products?id=${id}`)
        if (res.ok) {
          const product: Product = await res.json()
          setName(product.name || {})
          setDescription(product.description || {})
          setShortDescription(product.short_description || {})
          setSlug(product.slug)
          setSku(product.sku)
          setMaterial(product.material || '')
          setHardness(product.hardness || '')
          setHardnessUnit(product.hardness_unit || 'Shore A')
          setSpecifications(product.specifications || [])
          setIsActive(product.is_active)
          setIsFeatured(product.is_featured)
        }
      } catch { /* ignore */ }
      setLoading(false)
    })
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const result = await saveProduct({
      id: productId,
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
    })

    if (result.error) {
      setError(result.error)
      setSaving(false)
    } else {
      router.push('/admin/products')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return
    const result = await removeProduct(productId)
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/admin/products')
    }
  }

  if (loading) {
    return (
      <div className={styles.pageContent}>
        <p>Loading product...</p>
      </div>
    )
  }

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/admin/products" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.topBarTitle}>Edit Product</h1>
        </div>
        <div className={styles.topBarRight}>
          <button type="button" onClick={handleDelete} className={`${styles.btn} ${styles.btnDanger}`}>
            <Trash2 size={16} /> Delete
          </button>
          <button type="submit" form="product-form" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
            {saving ? 'Saving...' : 'Update Product'}
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
                <label className={styles.formLabel}>Slug</label>
                <input type="text" className={styles.formInput} value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>SKU</label>
                <input type="text" className={styles.formInput} value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Material</label>
                <input type="text" className={styles.formInput} value={material} onChange={(e) => setMaterial(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Hardness</label>
                  <input type="text" className={styles.formInput} value={hardness} onChange={(e) => setHardness(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Unit</label>
                  <select className={styles.formSelect} value={hardnessUnit} onChange={(e) => setHardnessUnit(e.target.value)}>
                    <option value="Shore A">Shore A</option>
                    <option value="Shore D">Shore D</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>Active</span>
                </label>
              </div>
              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>Featured</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
