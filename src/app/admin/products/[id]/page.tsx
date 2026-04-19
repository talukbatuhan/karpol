'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import I18nFieldEditor from '@/components/admin/I18nFieldEditor'
import LocalizedSlugInput from '@/components/admin/LocalizedSlugInput'
import SkuInput from '@/components/admin/SkuInput'
import SpecificationBuilder from '@/components/admin/SpecificationBuilder'
import SizeTableBuilder from '@/components/admin/SizeTableBuilder'
import GalleryBuilder from '@/components/admin/GalleryBuilder'
import TechnicalDrawingBuilder from '@/components/admin/TechnicalDrawingBuilder'
import Model3DBuilder from '@/components/admin/Model3DBuilder'
import DatasheetBuilder from '@/components/admin/DatasheetBuilder'
import ApplicationsBuilder from '@/components/admin/ApplicationsBuilder'
import ModuleToggleBar from '@/components/admin/ModuleToggleBar'
import ProductCoverImagesBuilder from '@/components/admin/ProductCoverImagesBuilder'
import ProductCardPreview from '@/components/admin/ProductCardPreview'
import { saveProduct, removeProduct } from '@/lib/actions/admin-product-actions'
import {
  DEFAULT_PRODUCT_MODULES,
  EMPTY_SIZE_TABLE,
  type LocalizedField,
  type LocalizedArrayField,
  type ProductSpecification,
  type SizeTable,
  type ProductGalleryAsset,
  type ProductTechnicalDrawing,
  type ProductModel3D,
  type ProductDatasheet,
  type ProductModules,
  type ProductCategory,
  type Product,
} from '@/types/database'
import { normalizeSizeTable } from '@/lib/product-utils'
import styles from '../../admin.module.css'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [productId, setProductId] = useState('')

  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [categoryId, setCategoryId] = useState('')

  const [name, setName] = useState<LocalizedField>({})
  const [description, setDescription] = useState<LocalizedField>({})
  const [shortDescription, setShortDescription] = useState<LocalizedField>({})
  const [slugs, setSlugs] = useState<LocalizedField>({})
  const [sku, setSku] = useState('')
  const [material, setMaterial] = useState('')
  const [hardness, setHardness] = useState('')
  const [hardnessUnit, setHardnessUnit] = useState('Shore A')
  const [color, setColor] = useState('')
  const [weight, setWeight] = useState('')
  const [temperatureMin, setTemperatureMin] = useState('')
  const [temperatureMax, setTemperatureMax] = useState('')

  const [modules, setModules] = useState<ProductModules>(DEFAULT_PRODUCT_MODULES)

  const [specifications, setSpecifications] = useState<ProductSpecification[]>([])
  const [sizeTable, setSizeTable] = useState<SizeTable>(EMPTY_SIZE_TABLE)
  const [gallery, setGallery] = useState<ProductGalleryAsset[]>([])
  const [technicalDrawings, setTechnicalDrawings] = useState<ProductTechnicalDrawing[]>([])
  const [model3d, setModel3d] = useState<ProductModel3D>({})
  const [datasheets, setDatasheets] = useState<ProductDatasheet[]>([])
  const [applications, setApplications] = useState<LocalizedArrayField>({ tr: [], en: [] })
  const [compatibleMachines, setCompatibleMachines] = useState('')

  const [images, setImages] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState('0')
  const [previewLocale, setPreviewLocale] = useState<'tr' | 'en'>('tr')

  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCategories(data)
      })
      .catch(() => {})
  }, [])

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
          const initialSlugs: LocalizedField =
            product.slugs && Object.keys(product.slugs).length > 0
              ? product.slugs
              : { tr: product.slug, en: product.slug }
          setSlugs(initialSlugs)
          setSku(product.sku)
          setCategoryId(product.category_id || '')
          setMaterial(product.material || '')
          setHardness(product.hardness || '')
          setHardnessUnit(product.hardness_unit || 'Shore A')
          setColor(product.color || '')
          setWeight(product.weight || '')
          setTemperatureMin(
            product.temperature_min !== undefined && product.temperature_min !== null
              ? String(product.temperature_min)
              : '',
          )
          setTemperatureMax(
            product.temperature_max !== undefined && product.temperature_max !== null
              ? String(product.temperature_max)
              : '',
          )
          setModules({ ...DEFAULT_PRODUCT_MODULES, ...(product.modules ?? {}) })
          setSpecifications(product.specifications || [])
          setSizeTable(normalizeSizeTable(product.size_table))
          setGallery(product.gallery || [])
          setTechnicalDrawings(product.technical_drawings || [])
          setModel3d(product.model_3d || {})
          setDatasheets(product.datasheets || [])
          setApplications(product.applications || { tr: [], en: [] })
          setCompatibleMachines((product.compatible_machines || []).join(', '))
          setImages(Array.isArray(product.images) ? product.images : [])
          setSortOrder(
            product.sort_order !== undefined && product.sort_order !== null
              ? String(product.sort_order)
              : '0',
          )
          setIsActive(product.is_active)
          setIsFeatured(product.is_featured)
        }
      } catch {
        /* ignore */
      }
      setLoading(false)
    })
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const canonicalSlug = (slugs.en || slugs.tr || '').trim()
    if (!canonicalSlug) {
      setError('Slug zorunludur. En az bir dil için slug girin.')
      setSaving(false)
      return
    }

    const result = await saveProduct({
      id: productId,
      name,
      description,
      short_description: shortDescription,
      slug: canonicalSlug,
      slugs,
      sku,
      category_id: categoryId || undefined,
      material: material || undefined,
      hardness: hardness || undefined,
      hardness_unit: hardnessUnit,
      color: color || undefined,
      weight: weight || undefined,
      temperature_min: temperatureMin ? Number(temperatureMin) : undefined,
      temperature_max: temperatureMax ? Number(temperatureMax) : undefined,
      modules,
      specifications: modules.specifications ? specifications : [],
      size_table: modules.size_table ? sizeTable : EMPTY_SIZE_TABLE,
      gallery: modules.gallery ? gallery : [],
      technical_drawings: modules.technical_drawing ? technicalDrawings : [],
      model_3d: modules.model_3d ? model3d : {},
      datasheets: modules.datasheet ? datasheets : [],
      applications: modules.applications ? applications : {},
      compatible_machines: compatibleMachines
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      is_active: isActive,
      is_featured: isFeatured,
      images,
      sort_order: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
    })

    if (result.error) {
      setError(result.error)
      setSaving(false)
    } else {
      router.push('/admin/products')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
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
        <p>Ürün yükleniyor...</p>
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
          <h1 className={styles.topBarTitle}>Ürünü Düzenle</h1>
        </div>
        <div className={styles.topBarRight}>
          <button
            type="button"
            onClick={handleDelete}
            className={`${styles.btn} ${styles.btnDanger}`}
          >
            <Trash2 size={16} /> Sil
          </button>
          <button
            type="submit"
            form="product-form"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={saving}
          >
            {saving ? 'Kaydediliyor...' : 'Güncelle'}
          </button>
        </div>
      </div>

      <div className={styles.pageContent}>
        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form id="product-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
            <div>
              <SectionTitle>Temel Bilgiler</SectionTitle>
              <I18nFieldEditor label="Ürün Adı" value={name} onChange={setName} required />
              <I18nFieldEditor
                label="Kısa Açıklama"
                value={shortDescription}
                onChange={setShortDescription}
              />
              <I18nFieldEditor
                label="Detaylı Açıklama"
                value={description}
                onChange={setDescription}
                multiline
              />

              <SectionTitle>Kategori Sayfası Önizlemesi</SectionTitle>
              <ProductCoverImagesBuilder
                value={images}
                onChange={setImages}
                productSlug={slugs.en || slugs.tr || ''}
              />

              <SectionTitle>İçerik Modülleri</SectionTitle>
              <ModuleToggleBar value={modules} onChange={setModules} />

              {modules.specifications && (
                <SpecificationBuilder value={specifications} onChange={setSpecifications} />
              )}

              {modules.size_table && (
                <SizeTableBuilder value={sizeTable} onChange={setSizeTable} />
              )}

              {modules.gallery && (
                <GalleryBuilder value={gallery} onChange={setGallery} productSlug={slugs.en || slugs.tr || ''} />
              )}

              {modules.technical_drawing && (
                <TechnicalDrawingBuilder
                  value={technicalDrawings}
                  onChange={setTechnicalDrawings}
                  productSlug={slugs.en || slugs.tr || ''}
                />
              )}

              {modules.model_3d && (
                <Model3DBuilder value={model3d} onChange={setModel3d} productSlug={slugs.en || slugs.tr || ''} />
              )}

              {modules.datasheet && (
                <DatasheetBuilder
                  value={datasheets}
                  onChange={setDatasheets}
                  productSlug={slugs.en || slugs.tr || ''}
                />
              )}

              {modules.applications && (
                <ApplicationsBuilder value={applications} onChange={setApplications} />
              )}
            </div>

            <div>
              <ProductCardPreview
                name={name}
                shortDescription={shortDescription}
                description={description}
                images={images}
                material={material}
                hardness={hardness}
                hardnessUnit={hardnessUnit}
                sku={sku}
                isActive={isActive}
                isFeatured={isFeatured}
                locale={previewLocale}
                onLocaleChange={setPreviewLocale}
              />

              <SectionTitle>Yayın Ayarları</SectionTitle>
              <LocalizedSlugInput
                label="URL Slug"
                value={slugs}
                onChange={setSlugs}
                source={name}
                required
                hint="Her dil için ayrı slug girin. Sihirli değnek ile ürün adından otomatik oluşturabilirsiniz."
              />

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kategori</label>
                <select
                  className={styles.formSelect}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">— Kategori seçin —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name?.tr || cat.name?.en || cat.slug}
                    </option>
                  ))}
                </select>
              </div>

              <SkuInput
                value={sku}
                onChange={setSku}
                categoryId={categoryId}
                required
              />

              <SectionTitle>Malzeme Bilgileri</SectionTitle>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Malzeme</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Sertlik</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={hardness}
                    onChange={(e) => setHardness(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Birim</label>
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
                <label className={styles.formLabel}>Renk</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ağırlık</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Min. Sıcaklık (°C)</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={temperatureMin}
                    onChange={(e) => setTemperatureMin(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Max. Sıcaklık (°C)</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={temperatureMax}
                    onChange={(e) => setTemperatureMax(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Uyumlu Makineler</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={compatibleMachines}
                  onChange={(e) => setCompatibleMachines(e.target.value)}
                  placeholder="virgülle ayırın"
                />
              </div>

              <SectionTitle>Görünürlük</SectionTitle>
              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>
                    Aktif
                  </span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>
                    Öne çıkan
                  </span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Sıralama</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="0"
                />
                <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                  Küçük sayı = kategori sayfasında daha üstte görünür.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 13,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
        margin: '24px 0 12px',
        paddingBottom: 6,
        borderBottom: '1px solid var(--border)',
      }}
    >
      {children}
    </h2>
  )
}
