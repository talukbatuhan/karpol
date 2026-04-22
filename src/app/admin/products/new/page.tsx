'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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
import { saveProduct } from '@/lib/actions/admin-product-actions'
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
} from '@/types/database'
import styles from '../../admin.module.css'
import { Label, Input, Select, Button, FormAlert } from '@/components/ui'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/admin/products" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.topBarTitle}>Yeni Ürün</h1>
        </div>
        <div className={styles.topBarRight}>
          <Button
            type="submit"
            form="product-form"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={saving}
          >
            {saving ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
          </Button>
        </div>
      </div>

      <div className={styles.pageContent}>
        {error && <FormAlert variant="adminBanner">{error}</FormAlert>}

        <form id="product-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
            <div>
              <SectionTitle>Temel Bilgiler</SectionTitle>
              <I18nFieldEditor label="Ürün Adı" value={name} onChange={setName} required />
              <I18nFieldEditor label="Kısa Açıklama" value={shortDescription} onChange={setShortDescription} />
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
                <DatasheetBuilder value={datasheets} onChange={setDatasheets} productSlug={slugs.en || slugs.tr || ''} />
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
                hint="Her dil için ayrı slug girin. Sağdaki sihirli değnek ile ürün adından otomatik oluşturabilirsiniz."
              />

              <div className={styles.formGroup}>
                <Label htmlFor="product-category" className={styles.formLabel}>
                  Kategori
                </Label>
                <Select
                  id="product-category"
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
                </Select>
              </div>

              <SkuInput
                value={sku}
                onChange={setSku}
                categoryId={categoryId}
                required
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
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="ör. Poliüretan"
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
                    value={hardness}
                    onChange={(e) => setHardness(e.target.value)}
                    placeholder="95"
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="product-hardness-unit" className={styles.formLabel}>
                    Birim
                  </Label>
                  <Select
                    id="product-hardness-unit"
                    className={styles.formSelect}
                    value={hardnessUnit}
                    onChange={(e) => setHardnessUnit(e.target.value)}
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
                <Input
                  id="product-color"
                  type="text"
                  className={styles.formInput}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="ör. Kırmızı"
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="product-weight" className={styles.formLabel}>
                  Ağırlık
                </Label>
                <Input
                  id="product-weight"
                  type="text"
                  className={styles.formInput}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="ör. 1.2 kg"
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
                    value={temperatureMin}
                    onChange={(e) => setTemperatureMin(e.target.value)}
                    placeholder="-30"
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
                    value={temperatureMax}
                    onChange={(e) => setTemperatureMax(e.target.value)}
                    placeholder="80"
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
                  value={compatibleMachines}
                  onChange={(e) => setCompatibleMachines(e.target.value)}
                  placeholder="Simec, Breton, Gaspari (virgülle ayırın)"
                />
                <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                  Birden fazla için virgül ile ayırın.
                </div>
              </div>

              <SectionTitle>Görünürlük</SectionTitle>
              <div className={styles.formGroup}>
                <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <Input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>
                    Aktif (sitede görünür)
                  </span>
                </Label>
              </div>

              <div className={styles.formGroup}>
                <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <Input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
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
                <Input
                  id="product-sort"
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
