'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
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
import DynamicStructuredFields from '@/components/admin/ProductForm/DynamicStructuredFields'
import { saveProduct, removeProduct } from '@/lib/actions/admin-product-actions'
import {
  buildProductFormSchema,
  productFormToServerPayload,
  canonicalProductSlug,
  type ProductFormInput,
} from '@/lib/validations/product-form'
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
  type CategoryAttributeDefinition,
  type SupportedLocale,
} from '@/types/database'
import { normalizeSizeTable } from '@/lib/product-utils'
import styles from '@/app/admin/admin.module.css'
import { Label, Input, Select, Button, FormAlert } from '@/components/ui'

type FormValues = ProductFormInput

const emptyForm: FormValues = {
  name: {},
  description: {},
  short_description: {},
  slugs: {},
  sku: '',
  category_id: '',
  material: '',
  hardness: '',
  hardness_unit: 'Shore A',
  color: '',
  weight: '',
  temperature_min: '',
  temperature_max: '',
  compatible_machines: '',
  is_active: true,
  is_featured: false,
  sort_order: '0',
  structured_attributes: {},
}

type ProductEditorFormProps = {
  mode: 'create' | 'edit'
  productId?: string
}

export default function ProductEditorForm({ mode, productId }: ProductEditorFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(mode === 'edit')
  const [structFieldErrors, setStructFieldErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [attributeDefinitions, setAttributeDefinitions] = useState<CategoryAttributeDefinition[]>([])
  const [modules, setModules] = useState<ProductModules>(DEFAULT_PRODUCT_MODULES)
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([])
  const [sizeTable, setSizeTable] = useState<SizeTable>(EMPTY_SIZE_TABLE)
  const [gallery, setGallery] = useState<ProductGalleryAsset[]>([])
  const [technicalDrawings, setTechnicalDrawings] = useState<ProductTechnicalDrawing[]>([])
  const [model3d, setModel3d] = useState<ProductModel3D>({})
  const [datasheets, setDatasheets] = useState<ProductDatasheet[]>([])
  const [applications, setApplications] = useState<LocalizedArrayField>({ tr: [], en: [] })
  const [images, setImages] = useState<string[]>([])
  const [previewLocale, setPreviewLocale] = useState<SupportedLocale>('tr')
  const prevCategoryRef = useRef<string | undefined>(undefined)

  const {
    register,
    watch,
    setValue,
    reset,
    getValues,
  } = useForm<FormValues>({
    defaultValues: emptyForm,
  })

  const categoryId = watch('category_id')
  const wSlugs = watch('slugs') as LocalizedField | undefined
  const wName = watch('name') as LocalizedField | undefined
  const wShort = watch('short_description') as LocalizedField | undefined
  const wDesc = watch('description') as LocalizedField | undefined
  const sAttr = (watch('structured_attributes') as Record<string, unknown> | undefined) ?? {}

  const productSlug = canonicalProductSlug(wSlugs)

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCategories(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!categoryId) {
      setAttributeDefinitions([])
      return
    }
    let cancelled = false
    fetch(`/api/admin/categories/${categoryId}/attribute-definitions`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setAttributeDefinitions(data)
        }
      })
      .catch(() => {
        if (!cancelled) setAttributeDefinitions([])
      })
    return () => {
      cancelled = true
    }
  }, [categoryId])

  useEffect(() => {
    if (mode === 'create' && prevCategoryRef.current !== undefined && prevCategoryRef.current !== categoryId) {
      setValue('structured_attributes', {})
    }
    prevCategoryRef.current = categoryId
  }, [categoryId, mode, setValue])

  useEffect(() => {
    if (mode !== 'edit' || !productId) return
    let cancelled = false
    setLoading(true)
    fetch(`/api/admin/products?id=${productId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((product: Product | null) => {
        if (cancelled || !product) return
        const initialSlugs: LocalizedField =
          product.slugs && Object.keys(product.slugs).length > 0
            ? product.slugs
            : { tr: product.slug, en: product.slug }
        reset({
          name: product.name || {},
          description: product.description || {},
          short_description: product.short_description || {},
          slugs: initialSlugs,
          sku: product.sku,
          category_id: product.category_id || '',
          material: product.material || '',
          hardness: product.hardness || '',
          hardness_unit: product.hardness_unit || 'Shore A',
          color: product.color || '',
          weight: product.weight || '',
          temperature_min:
            product.temperature_min !== undefined && product.temperature_min !== null
              ? String(product.temperature_min)
              : '',
          temperature_max:
            product.temperature_max !== undefined && product.temperature_max !== null
              ? String(product.temperature_max)
              : '',
          compatible_machines: (product.compatible_machines || []).join(', '),
          is_active: product.is_active,
          is_featured: product.is_featured,
          sort_order:
            product.sort_order !== undefined && product.sort_order !== null
              ? String(product.sort_order)
              : '0',
          structured_attributes: (product.structured_attributes as Record<string, unknown>) || {},
        })
        setModules({ ...DEFAULT_PRODUCT_MODULES, ...(product.modules ?? {}) })
        setSpecifications(product.specifications || [])
        setSizeTable(normalizeSizeTable(product.size_table))
        setGallery(product.gallery || [])
        setTechnicalDrawings(product.technical_drawings || [])
        setModel3d(product.model_3d || {})
        setDatasheets(product.datasheets || [])
        setApplications(
          (product.applications as LocalizedArrayField) || { tr: [], en: [] },
        )
        setImages(Array.isArray(product.images) ? product.images : [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [mode, productId, reset])

  const onValid = async (data: FormValues) => {
    setSaving(true)
    setError('')
    const base = productFormToServerPayload(data, {
      ...(mode === 'edit' && productId ? { id: productId } : {}),
      modules,
      specifications: modules.specifications ? specifications : [],
      size_table: modules.size_table ? sizeTable : EMPTY_SIZE_TABLE,
      gallery: modules.gallery ? gallery : [],
      technical_drawings: modules.technical_drawing ? technicalDrawings : [],
      model_3d: modules.model_3d ? model3d : {},
      datasheets: modules.datasheet ? datasheets : [],
      applications: modules.applications ? applications : {},
      images,
    })
    const result = await saveProduct(base as Record<string, unknown>)
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/admin/products')
    }
    setSaving(false)
  }

  const parseAndSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStructFieldErrors({})
    const data = getValues()
    const parsed = buildProductFormSchema(attributeDefinitions).safeParse(data)
    if (!parsed.success) {
      const structErr: Record<string, string> = {}
      for (const iss of parsed.error.issues) {
        const p = iss.path
        if (p[0] === 'structured_attributes' && typeof p[1] === 'string') {
          structErr[p[1]] = iss.message
        }
      }
      setStructFieldErrors(structErr)
      const first = parsed.error.issues[0]?.message ?? 'Formu kontrol edin'
      setError(first)
      return
    }
    setError('')
    void onValid(parsed.data)
  }

  const handleDelete = async () => {
    if (mode !== 'edit' || !productId) return
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
          <h1 className={styles.topBarTitle}>
            {mode === 'create' ? 'Yeni Ürün' : 'Ürünü Düzenle'}
          </h1>
        </div>
        <div className={styles.topBarRight}>
          {mode === 'edit' && (
            <Button
              type="button"
              onClick={handleDelete}
              className={`${styles.btn} ${styles.btnDanger}`}
            >
              <Trash2 size={16} /> Sil
            </Button>
          )}
          <Button
            type="submit"
            form="product-form"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={saving}
          >
            {saving
              ? 'Kaydediliyor...'
              : mode === 'create'
                ? 'Ürünü Kaydet'
                : 'Güncelle'}
          </Button>
        </div>
      </div>

      <div className={styles.pageContent}>
        {error && <FormAlert variant="adminBanner">{error}</FormAlert>}

        <form id="product-form" onSubmit={parseAndSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
            <div>
              <SectionTitle>Temel Bilgiler</SectionTitle>
              <I18nFieldEditor
                label="Ürün Adı"
                value={wName ?? {}}
                onChange={(v) => setValue('name', v, { shouldValidate: true })}
                required
              />
              <I18nFieldEditor
                label="Kısa Açıklama"
                value={wShort ?? {}}
                onChange={(v) => setValue('short_description', v)}
              />
              <I18nFieldEditor
                label="Detaylı Açıklama"
                value={wDesc ?? {}}
                onChange={(v) => setValue('description', v)}
                multiline
              />

              <SectionTitle>Kategori Sayfası Önizlemesi</SectionTitle>
              <ProductCoverImagesBuilder
                value={images}
                onChange={setImages}
                productSlug={productSlug}
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
                <GalleryBuilder value={gallery} onChange={setGallery} productSlug={productSlug} />
              )}

              {modules.technical_drawing && (
                <TechnicalDrawingBuilder
                  value={technicalDrawings}
                  onChange={setTechnicalDrawings}
                  productSlug={productSlug}
                />
              )}

              {modules.model_3d && (
                <Model3DBuilder value={model3d} onChange={setModel3d} productSlug={productSlug} />
              )}

              {modules.datasheet && (
                <DatasheetBuilder value={datasheets} onChange={setDatasheets} productSlug={productSlug} />
              )}

              {modules.applications && (
                <ApplicationsBuilder value={applications} onChange={setApplications} />
              )}
            </div>

            <div>
              <ProductCardPreview
                name={wName ?? {}}
                shortDescription={wShort ?? {}}
                description={wDesc ?? {}}
                images={images}
                material={watch('material')}
                hardness={watch('hardness')}
                hardnessUnit={watch('hardness_unit')}
                sku={watch('sku')}
                isActive={watch('is_active')}
                isFeatured={watch('is_featured')}
                locale={previewLocale}
                onLocaleChange={setPreviewLocale}
              />

              <SectionTitle>Yayın Ayarları</SectionTitle>
              <LocalizedSlugInput
                label="URL Slug"
                value={wSlugs ?? {}}
                onChange={(v) => setValue('slugs', v, { shouldValidate: true })}
                source={wName}
                required
                hint="Her dil için ayrı slug girin. Sihirli değnek ile ürün adından otomatik oluşturabilirsiniz."
              />

              <div className={styles.formGroup}>
                <Label htmlFor="product-category" className={styles.formLabel}>
                  Kategori
                </Label>
                <Select
                  id="product-category"
                  className={styles.formSelect}
                  {...register('category_id')}
                >
                  <option value="">— Kategori seçin —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name?.tr || cat.name?.en || cat.slug}
                    </option>
                  ))}
                </Select>
              </div>

              <SkuInput
                value={watch('sku')}
                onChange={(v) => setValue('sku', v, { shouldValidate: true })}
                categoryId={categoryId || ''}
                required
              />

              <DynamicStructuredFields
                definitions={attributeDefinitions}
                value={sAttr}
                onChange={(next) => setValue('structured_attributes', next, { shouldValidate: true })}
                fieldErrors={structFieldErrors}
              />

              <SectionTitle>Malzeme Bilgileri</SectionTitle>
              <div className={styles.formGroup}>
                <Label htmlFor="product-material" className={styles.formLabel}>
                  Malzeme
                </Label>
                <Input
                  id="product-material"
                  type="text"
                  className={styles.formInput}
                  placeholder="ör. Poliüretan"
                  {...register('material')}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={styles.formGroup}>
                  <Label htmlFor="product-hardness" className={styles.formLabel}>
                    Sertlik
                  </Label>
                  <Input
                    id="product-hardness"
                    type="text"
                    className={styles.formInput}
                    placeholder="95"
                    {...register('hardness')}
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="product-hardness-unit" className={styles.formLabel}>
                    Birim
                  </Label>
                  <Select
                    id="product-hardness-unit"
                    className={styles.formSelect}
                    {...register('hardness_unit')}
                  >
                    <option value="Shore A">Shore A</option>
                    <option value="Shore D">Shore D</option>
                  </Select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="product-color" className={styles.formLabel}>
                  Renk
                </Label>
                <Input id="product-color" type="text" className={styles.formInput} {...register('color')} />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="product-weight" className={styles.formLabel}>
                  Ağırlık
                </Label>
                <Input
                  id="product-weight"
                  type="text"
                  className={styles.formInput}
                  {...register('weight')}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={styles.formGroup}>
                  <Label htmlFor="product-tmin" className={styles.formLabel}>
                    Min. Sıcaklık (°C)
                  </Label>
                  <Input
                    id="product-tmin"
                    type="number"
                    className={styles.formInput}
                    {...register('temperature_min')}
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="product-tmax" className={styles.formLabel}>
                    Max. Sıcaklık (°C)
                  </Label>
                  <Input
                    id="product-tmax"
                    type="number"
                    className={styles.formInput}
                    {...register('temperature_max')}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="product-machines" className={styles.formLabel}>
                  Uyumlu Makineler
                </Label>
                <Input
                  id="product-machines"
                  type="text"
                  className={styles.formInput}
                  {...register('compatible_machines')}
                />
                <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                  Birden fazla için virgül ile ayırın.
                </div>
              </div>

              <SectionTitle>Görünürlük</SectionTitle>
              <div className={styles.formGroup}>
                <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!!watch('is_active')}
                    onChange={(e) => setValue('is_active', e.target.checked)}
                  />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>
                    Aktif (sitede görünür)
                  </span>
                </Label>
              </div>

              <div className={styles.formGroup}>
                <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!!watch('is_featured')}
                    onChange={(e) => setValue('is_featured', e.target.checked)}
                  />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>
                    Öne çıkan ürün
                  </span>
                </Label>
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="product-sort" className={styles.formLabel}>
                  Sıralama
                </Label>
                <Input id="product-sort" type="number" className={styles.formInput} {...register('sort_order')} />
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
